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

export const generateVideoThumbnails = async (video: HTMLVideoElement, mediaJson: MediaJsonRes, numberOfThumbnails: number): Promise<string[]> => {
    let thumbnail: any[] = [];
    let fractions: number[] = [];

    return new Promise(async (resolve, reject) => {
        if (!mediaJson.mediaType?.includes("video")) reject("not a valid video file");
        await getVideoDuration(video).then(async (duration) => {
            // divide the video timing into particular timestamps in respective to number of thumbnails
            // ex if time is 10 and numOfthumbnails is 4 then result will be -> 0, 2.5, 5, 7.5 ,10
            // we will use this timestamp to take snapshots
            for (let i = 0; i <= duration; i += duration / numberOfThumbnails) {
                fractions.push(Math.floor(i));
            }
            // the array of promises
            let promiseArray = fractions.map((time) => {
                return getVideoThumbnail(mediaJson, time)
            })
            // console.log('promiseArray', promiseArray)
            // console.log('duration', duration)
            // console.log('fractions', fractions)
            await Promise.all(promiseArray).then((res) => {
                res.forEach((res) => {
                    // console.log('res', res.slice(0,8))
                    thumbnail.push(res);
                });
                // console.log('thumbnail', thumbnail)
                resolve(thumbnail);
            }).catch((err) => {
                console.error(err)
            }).finally(() => {
                resolve(thumbnail);
            })
        });
        reject("something went wront");
    });
};

export const getVideoThumbnail = (mediaJson: MediaJsonRes, videoTimeInSeconds: number) => {
    return new Promise((resolve, reject) => {
        if (mediaJson.mediaType.includes("video")) {
            var video = document.createElement("video");
            var timeupdate = function() {
                if (snapImage()) {
                    video.removeEventListener("timeupdate", timeupdate);
                    video.pause();
                }
            };
            video.addEventListener("loadeddata", function() {
                if (snapImage()) {
                    video.removeEventListener("timeupdate", timeupdate);
                }
            });
            var snapImage = function() {
                var canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
                var image = canvas.toDataURL();
                var success = image.length > 100000;
                if (success) {
                    resolve(image);
                }
                return success;
            };
            video.addEventListener("timeupdate", timeupdate);
            video.preload = "metadata";
            video.src = `/api/getMedia?mediaPath=${mediaJson.mediaPath}`;
            // Load video in Safari / IE11
            video.muted = true;
            video.playsInline = true;
            video.currentTime = videoTimeInSeconds;
            video.play();
        } else {
            reject("file not valid");
        }
    });
};

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
