"use client"

import { Suspense, useEffect } from "react"
import MediaShow from "./MediaShow"
import { getMedias } from "@/actions/getMedia"
import { useInView } from "react-intersection-observer"
import { mediaNotFinished, mediaList, mediaOffset, filter } from "@/utils/signals"
import { Show } from "@preact/signals-react/utils";
import { useSignals } from "@preact/signals-react/runtime"
import { filterTypeToPrimative } from "@/utils/clientUtil"

export default function MediaScroll() {
    useSignals();
    const { ref, inView } = useInView()
    console.log("MediaScroll")

    async function loadMoreMedias() {
        const f = filterTypeToPrimative(filter);
        const apiMedias = await getMedias(mediaOffset.value, 10, f)
        console.log("apiMedias: " + apiMedias)
        if (apiMedias.length <= 0){
            mediaNotFinished.value = false
            return
        }
        mediaList.value = [...mediaList.value, ...apiMedias]
        mediaOffset.value = mediaOffset.value + 10
    }

    useEffect(() => {
        if (inView && mediaNotFinished.value) {
            loadMoreMedias()
        }
    }, [inView])

    return (
        <div>
            <div className="grid grid-cols-4">
                <Suspense>
                {mediaList.value.map((m) => (
                    <div key={m.id}>
                        <MediaShow media={m} />
                    </div>
                ))}
                </Suspense>
            </div>
            <Show when={mediaNotFinished}>
                <div className="flex justify-center">
                    <div ref={ref} className="p-5 border-1 rounded-lg">Loading...</div>
                </div>
            </Show>
        </div>
    )
}

