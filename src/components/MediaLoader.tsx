"use client"

import { getMedias } from "@/actions/getMedia";
import { filterTypeToPrimative, getMediaSizing } from "@/utils/clientUtil";
import { filter, mediaList, mediaNotFinished, mediaOffset, mediaPresentIdx } from "@/utils/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { Suspense, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "./ui/button";
import MediaShow from "./MediaShow";
import { FilterPrimative } from "@/_types/type";
import MediaPresent from "./MediaPresent";
import { Show } from "@preact/signals-react/utils";
import { Album } from "@/db/types";
import { getAllAlbums } from "@/actions/getAllAlbums";

type MediaLoaderType = {
    gridCols?: number
    reset?: boolean
    filter?: FilterPrimative
    sizeScale?: number
}

export default function MediaLoader(props: MediaLoaderType) {
    useSignals();

    const { ref, inView } = useInView()
    const [allAlbums, setAllAlbums] = useState<Album[]>([])
    const [tabIdx, setTabIdx] = useState<number>(0)
    const tabIdxRef = useRef<number>(tabIdx)

    async function loadMoreMedias() {
        let f;
        let mediaCnt = 10;
        if (!props.filter) {
            f = filterTypeToPrimative(filter);
        } else {
            f = props.filter
        }
        const apiMedias = await getMedias(mediaOffset.value, mediaCnt, f)
        console.log(apiMedias)
        if (apiMedias.length <= 0) {
            mediaNotFinished.value = false;
            return
        }
        mediaList.value = [...mediaList.value, ...apiMedias];
        mediaOffset.value += mediaCnt;
    }

    function emptyMedia() {
        mediaNotFinished.value = true
        mediaOffset.value = 0;
        mediaList.value = []
    }

    useEffect(() => {
        async function fun() {
            const x = await getAllAlbums();
            setAllAlbums(x);
        }
        fun();

        if (props.reset) {
            emptyMedia();
        }
    }, [])

    useEffect(() => {
        if (inView && mediaNotFinished.value) {
            loadMoreMedias()
        }
    }, [inView])

    function mediaClick(idx: number) {
        mediaPresentIdx.value = idx
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.code === "ArrowRight") {
            setTabIdx(prev => {
                document.getElementById(`Media-Show-${mediaList.value[prev + 1]?.id}`)?.scrollIntoView({ block: "center" });
                tabIdxRef.current = prev + 1;
                return prev + 1;
            });
        } else if (e.code === "ArrowLeft") {
            setTabIdx(prev => {
                document.getElementById(`Media-Show-${mediaList.value[prev - 1]?.id}`)?.scrollIntoView({ block: "center" });
                tabIdxRef.current = prev - 1;
                return prev - 1;
            });
        } else if (e.code === "ControlRight") {
            mediaClick(tabIdxRef.current)
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", keyDownHandler);

        // clean up
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [])

    return (
        <div>
            <div className={`grid w-full h-full`}
                style={{ "gridTemplateColumns": `repeat(${props.gridCols || 4}, minmax(0, 1fr))` }}>
                {mediaList.value.map((m, i) => (
                    <Suspense key={`Media-Loader-${m.id}-${i}`}>
                        <MediaShow media={m} idx={i} dimensionType={getMediaSizing(m.mediaWidth, m.mediaHeight)}
                            onClick={() => { setTabIdx(i) }}
                            sizeScale={props.sizeScale} onMedia={mediaClick} focus={i == tabIdx} />
                    </Suspense>
                ))}
            </div>
            {mediaPresentIdx.value != null &&
                <Suspense>
                    <MediaPresent mediaAlbums={mediaList.value[mediaPresentIdx.value]} mediaIdx={mediaPresentIdx.value} allAlbums={allAlbums} />
                </Suspense>
            }
            <Show when={mediaNotFinished}>
                <div className="flex flex-col justify-center mt-20 gap-3">
                    <div ref={ref} className="w-fit mx-auto p-5 border-1 rounded-lg">Loading...</div>
                    <Button onClick={loadMoreMedias} className="w-fit mx-auto p-5 border-1 rounded-lg">Load More</Button>
                </div>
            </Show>
        </div>
    )
}

