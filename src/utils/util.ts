import { MediaType } from "@/_types/type";
import { FileError } from "@/errors/Files";
import { exec } from "child_process";
import { createReadStream, ReadStream } from "fs";

export const getType = (mimeType: string): MediaType => {
    if (mimeType.includes("image")) {
        return MediaType.photos
    } else if (mimeType.includes("mp4") || mimeType.includes("video")) {
        return MediaType.videos
    }
    return MediaType.photos
}


// convert image to object part instead of base64 for better performance
// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
// export const importFileandPreview = (file: MediaJsonRes, revoke: boolean = false): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         window.URL = window.URL || window.webkitURL;
//         let preview = window.URL.createObjectURL(file.mediaPath);
//         // remove reference
//         if (revoke) {
//             window.URL.revokeObjectURL(preview);
//         }
//         setTimeout(() => {
//             resolve(preview);
//         }, 100);
//     });
// }

export const getVideoData = (filename: string): Promise<{ width: number, height: number, durationInSecs: number }> => {
    return new Promise((resolve, reject) => {
        try {
            exec(`ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width -show_entries format=duration "${filename}"`, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject({ ...error, stderr })
                }
                console.log(stdout)
                var width = /width=(\d+)/.exec(stdout);
                var height = /height=(\d+)/.exec(stdout);
                var duration = /duration="([\d\.]+)"/.exec(stdout);
                console.log(duration)
                if (!(width && height)) {
                    reject(`No dimensions found! Filename: ${filename}`)
                }
                if (width == null || height == null || !duration) {
                    reject(`Error occurred ${stderr}`)
                }
                resolve({
                    width: parseInt((width as any)[1]),
                    height: parseInt((height as any)[1]),
                    durationInSecs: parseInt((duration as any)[1])
                })
            });
        } catch (error) {
            reject({ ...error as any, filename });
        }
    });
}

export const getExifData = (filename: string): Promise<{ [key: string]: string } | FileError> => {
    return new Promise((resolve, reject) => {
        try {
            exec(`exiftool -a -G1 "${filename}"`, (error, stdout, stderr) => {
                if (error || stderr) {
                    reject({ ...error, stderr })
                }
                let o: { [key: string]: string } = {}
                let lines = stdout.split("\n")
                for (let x in lines) {
                    let l = lines[x]
                    let v = l.split(':', 2);
                    if (v.length >= 2) {
                        let vari = v[0].trim();
                        let ans = v[1].trim();
                        o[vari.toString()] = ans;
                    }
                }
                resolve(o);
            })
        } catch (error) {
            reject(new FileError("103", filename, JSON.stringify(error)));
        }
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#convert_an_iterator_or_async_iterator_to_a_stream
export function iteratorToStream(
    iterator: AsyncGenerator<Uint8Array, void, unknown>
): ReadableStream {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (value) {
                controller.enqueue(value);
            }
            if (done) {
                controller.close();
            }
        }
    });
}

export async function* nodeStreamToIterator(stream: ReadStream) {
    for await (const chunk of stream) {
        yield new Uint8Array(chunk);
    }
}

export function streamFile(
    filePath: string,
    options?: { start?: number; end?: number }
): ReadableStream {
    return iteratorToStream(
        nodeStreamToIterator(createReadStream(filePath, options))
    );
}
