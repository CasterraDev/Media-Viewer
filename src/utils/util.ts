import { createReadStream, ReadStream } from "fs";

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
