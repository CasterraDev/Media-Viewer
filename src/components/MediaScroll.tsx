"use client"

import { ReactNode, Suspense, useEffect } from "react"
import MediaShow from "./MediaShow"
import { getMedias } from "@/actions/getMedia"
import { useInView } from "react-intersection-observer"
import { mediaNotFinished, mediaList, mediaOffset, filter, mediaPresentIdx } from "@/utils/signals"
import { Show } from "@preact/signals-react/utils";
import { useSignals } from "@preact/signals-react/runtime"
import { filterTypeToPrimative, getMediaSizing } from "@/utils/clientUtil"
import { MediaSizing } from "@/_types/type"
import { Button } from "./ui/button"
import MediaPresent from "./MediaPresent"


export default function MediaScroll() {
    useSignals();
    const { ref, inView } = useInView()
    console.log("MediaScroll")
    const maxCols = 4

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

    function mediaGrid(p: (ReactNode | ReactNode[])[], aw: number, ah: number): (ReactNode | ReactNode[])[] {
        useSignals();
        let r: (ReactNode | ReactNode[])[] = p
        let halfSpots = Math.floor(maxCols / 2)
        for (let i = 0; i < mediaList.value.length; i++) {
            let advance = maxCols
            const m = mediaList.value[i];
            let sizingArr: string[] = [];
            let sizingIdxs: { [id: string]: number[] } = {};
            sizingIdxs[MediaSizing[MediaSizing.square]] = [];
            sizingIdxs[MediaSizing[MediaSizing.landscape]] = [];
            sizingIdxs[MediaSizing[MediaSizing.portrait]] = [];
            let relCntTillNotLandscape = 0;

            let d: { [id: string]: number } = {};
            d[MediaSizing[MediaSizing.square]] = 0;
            d[MediaSizing[MediaSizing.landscape]] = 0;
            d[MediaSizing[MediaSizing.portrait]] = 0;

            let stillCnting = true;
            for (let y = 0; y < maxCols; y++) {
                if (i + y >= mediaList.value.length) {
                    break;
                }
                let x = getMediaSizing(mediaList.value[i + y].mediaWidth, mediaList.value[i + y].mediaHeight)
                sizingArr.push(MediaSizing[x])
                sizingIdxs[MediaSizing[x]].push(y)
                if (stillCnting) {
                    if (x == MediaSizing.landscape) {
                        relCntTillNotLandscape++;
                    } else {
                        stillCnting = false
                    }
                }
                d[MediaSizing[x]] = d[MediaSizing[x]] + 1
            }

            console.log(d)
            let sq = MediaSizing[MediaSizing.square];
            let pt = MediaSizing[MediaSizing.portrait];
            let ls = MediaSizing[MediaSizing.landscape];
            let dsq = d[sq];
            let dpt = d[pt];
            let dls = d[ls];

            if (dpt == maxCols) {
                console.log("Portrait")

                r.push(
                    <div className="Portrait grid w-full h-full" key={m.id}
                        style={{ "gridTemplateColumns": `repeat(${maxCols}, minmax(0, 1fr))` }}>
                        <MediaShow media={m} idx={i} dimensionType={MediaSizing.portrait} />
                        <MediaShow media={mediaList.value[i + 1]} idx={i + 1} dimensionType={MediaSizing.portrait} />
                        <MediaShow media={mediaList.value[i + 2]} idx={i + 2} dimensionType={MediaSizing.portrait} />
                        <MediaShow media={mediaList.value[i + 3]} idx={i + 3} dimensionType={MediaSizing.portrait} />
                    </div>
                )
                advance = maxCols - 1
            } else if (dsq == maxCols) {
                console.log("Square")

                r.push(
                    <div className="Square grid w-full h-full" key={m.id}
                        style={{ "gridTemplateColumns": `repeat(${maxCols}, minmax(0, 1fr))` }}>
                        <MediaShow media={m} idx={i} dimensionType={MediaSizing.square} />
                        <MediaShow media={mediaList.value[i + 1]} idx={i + 1} dimensionType={MediaSizing.square} />
                        <MediaShow media={mediaList.value[i + 2]} idx={i + 2} dimensionType={MediaSizing.square} />
                        <MediaShow media={mediaList.value[i + 3]} idx={i + 3} dimensionType={MediaSizing.square} />
                    </div>
                )
                advance = maxCols - 1
            } else if (relCntTillNotLandscape >= halfSpots) {
                console.log("Landscape")

                r.push(
                    <div className="Landscape grid w-full h-full" key={m.id}
                        style={{ "gridTemplateColumns": `repeat(${halfSpots}, minmax(0, 1fr))` }}>
                        <MediaShow media={m} idx={i} dimensionType={MediaSizing.landscape} />
                        <MediaShow media={mediaList.value[i + 1]} idx={i + 1} dimensionType={MediaSizing.landscape} />
                    </div>
                )
                advance = halfSpots - 1
            } else {
                r.push(
                    <div className={`Else ${relCntTillNotLandscape} ${halfSpots} grid w-full h-fit grid-cols-4`} key={m.id}>
                        {[...Array(4)].map((_k, idx) => {
                            if (i + idx >= mediaList.value.length) return;
                            return (
                                <MediaShow idx={i + idx} key={`${mediaList.value[i + idx].id}-show`} media={mediaList.value[i + idx]} dimensionType={getMediaSizing(mediaList.value[i + idx].mediaWidth, mediaList.value[i + idx].mediaHeight)} />
                            )
                        })}
                    </div>
                )
                advance = maxCols - 1
            }


            i += advance
        }
        return r;
    }

    function easyGrid(): ReactNode {
        return (
            <div className="grid w-full h-fit grid-cols-4">
                <Suspense>
                    {mediaList.value.map((m, i) => (
                        <div key={m.id}>
                            <MediaShow media={m} idx={i} dimensionType={MediaSizing.portrait} />
                        </div>
                    ))}
                </Suspense>
            </div>
        )
    }

    return (
        <div className="w-full h-fit">
            {false ?
                <>
                    {easyGrid()}
                </>
                :
                <div className="flex flex-col">
                    {mediaGrid([], maxCols, 1)}
                </div>
            }
            {mediaPresentIdx.value != null &&
                <MediaPresent mediaIdx={mediaPresentIdx.value} />
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

