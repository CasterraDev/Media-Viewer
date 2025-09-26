"use client"

import { ReactNode, ReactPortal, Suspense, useEffect, useState } from "react"
import MediaShow from "./MediaShow"
import { getMedias } from "@/actions/getMedia"
import { useInView } from "react-intersection-observer"
import { mediaNotFinished, mediaList, mediaOffset, filter } from "@/utils/signals"
import { Show } from "@preact/signals-react/utils";
import { useSignals } from "@preact/signals-react/runtime"
import { filterTypeToPrimative } from "@/utils/clientUtil"

export default function MediaScroll() {
    useSignals();
    const [mediaReact, setMediaReact] = useState<ReactNode[]>([])
    const { ref, inView } = useInView()
    console.log("MediaScroll")

    async function loadMoreMedias() {
        const f = filterTypeToPrimative(filter);
        const apiMedias = await getMedias(mediaOffset.value, 10, f)
        console.log("apiMedias: " + apiMedias)
        if (apiMedias.length <= 0) {
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

    function mediaGrid(): (ReactNode | ReactNode[])[] {
        const maxCols = 4
        let r: (ReactNode | ReactNode[])[] = []
        for (let i = 0; i < mediaList.value.length; i++) {
            const m = mediaList.value[i];
            r.push(
                <div key={m.id} className="grid"
                    style={{["gridTemplateColumns"]: `repeat(${maxCols}, minmax(0, 1fr))`}}>
                    <MediaShow media={m} dimensionType="portrait" />
                    <MediaShow media={mediaList.value[i + 1]} dimensionType="portrait" />
                    <MediaShow media={mediaList.value[i + 2]} dimensionType="portrait" />
                    <MediaShow media={mediaList.value[i + 3]} dimensionType="portrait" />
                </div>
            )
            i += 3
        }
        return r;
    }

    function easyGrid(): ReactNode {
        return (
            <div className="grid w-full h-fit grid-cols-4">
                <Suspense>
                    {mediaList.value.map((m) => (
                        <div key={m.id}>
                            <MediaShow media={m} dimensionType="portrait" />
                        </div>
                    ))}
                </Suspense>
            </div>
        )
    }

    return (
        <div className="w-full h-fit">
            {true ?
                <>
                    {easyGrid()}
                </>
                :
                <div className="flex flex-col">
                    {mediaGrid()}
                </div>
            }
            <Show when={mediaNotFinished}>
                <div className="flex justify-center mt-100">
                    <div ref={ref} className="p-5 border-1 rounded-lg">Loading...</div>
                </div>
            </Show>
        </div>
    )
}

