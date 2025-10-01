import { MediaType } from "@/_types/type";
import { exec } from "child_process";
import { createReadStream, ReadStream } from "fs";
var assert = require('assert');

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
        exec(`ffprobe -v error -of flat=s=_ -select_streams v:0 -show_entries stream=height,width -show_entries format=duration "${filename}"`, (error, stdout, stderr) => {
            if (error || stderr){
                reject(`Error occurred ${stderr}`)
            }
            console.log(stdout)
            var width = /width=(\d+)/.exec(stdout);
            var height = /height=(\d+)/.exec(stdout);
            var duration = /duration="([\d\.]+)"/.exec(stdout);
            console.log(duration)
            assert(width && height, 'No dimensions found!');
            if (width == null || height == null || !duration) {
                reject(`Error occurred ${stderr}`)
            }
            resolve({
                width: parseInt((width as any)[1]),
                height: parseInt((height as any)[1]),
                durationInSecs: parseInt((duration as any)[1])
            })
        });
    });
}

export const getVideoDuration = (video: HTMLVideoElement): Promise<number> => {
    return new Promise((resolve, reject) => {
        try {
            video.addEventListener("loadeddata", function() {
                resolve(video.duration);
            });
            video.preload = "metadata";
            // Load video in Safari / IE11
            video.muted = true;
            video.playsInline = true;
            video.play();
            //  window.URL.revokeObjectURL(url);
        } catch (error) {
            reject(error);
        }
    });
};

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
