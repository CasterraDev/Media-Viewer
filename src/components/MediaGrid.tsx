import { MediaSizing } from "@/_types/type";
import { getMediaSizing } from "@/utils/clientUtil";
import { mediaList } from "@/utils/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { ReactNode } from "react";
import MediaShow from "./MediaShow";

export default function MediaGrid({ maxCols = 4 }: { maxCols?: number }) {
    let lastAdvance = 0;
    let lastCompleted = true;
    let sq = MediaSizing[MediaSizing.square];
    let pt = MediaSizing[MediaSizing.portrait];
    let ls = MediaSizing[MediaSizing.landscape];

    let s = { [sq]: { width: 1, height: 1 }, [pt]: { width: 1, height: 2 }, [ls]: { width: 2, height: 1 } }

    function gridRec(idx: number, p: (ReactNode | ReactNode[])[], aw: number, ah: number, firstInRow: boolean): { reactNodes: (ReactNode | ReactNode[])[], advance: number, completed: boolean } {
        let advance = maxCols
        let halfSpots = Math.floor(aw / 2)
        const m = mediaList.value[idx];

        let sizingArr: { str: string, enum: MediaSizing }[] = [];
        let sizingIdxs: { [id: string]: number[] } = { [sq]: [], [ls]: [], [pt]: [] };

        let d: { [id: string]: number } = { [sq]: 0, [ls]: 0, [pt]: 0 };

        let maxItems = maxCols;

        let stillCnting = true;
        let relCntTillNotLandscape = 0;
        for (let y = 0; y < maxItems; y++) {
            if (idx + y >= mediaList.value.length) {
                break;
            }
            let x = getMediaSizing(mediaList.value[idx + y].mediaWidth, mediaList.value[idx + y].mediaHeight)
            sizingArr.push({ str: MediaSizing[x], enum: x })
            sizingIdxs[MediaSizing[x]].push(y)
            d[MediaSizing[x]] = d[MediaSizing[x]] + 1
            if (stillCnting) {
                if (x == MediaSizing.landscape) {
                    relCntTillNotLandscape++;
                } else {
                    stillCnting = false
                }
            }
        }
        let dsq = d[sq];
        let dpt = d[pt];
        let dls = d[ls];

        let w: (ReactNode | ReactNode[])[] = []
        let t: (ReactNode | ReactNode[])[] = []

        if (firstInRow) {
            console.log("DPT: " + dpt + ", DSQ: " + dsq + ", DLS: " + dls)
            if (dpt >= maxCols || dsq >= maxCols) {
                for (let y = 0; y < maxCols; y++) {
                    t.push(<MediaShow key={`Media-Show-Thumb-${idx + y}`} sizeScale={.25} media={mediaList.value[idx + y]} idx={idx + y} dimensionType={sizingArr[y].enum} />)
                }

                advance = maxCols
                w.push(
                    <div className="grid w-full h-full" key={`Media-Grid-${idx}`}
                        style={{ "gridTemplateColumns": `repeat(${maxCols}, minmax(0, 1fr))` }}>
                        {t}
                    </div>
                );
                console.log("AdvanceNLS: " + advance)
                p.push(w);
                return { reactNodes: p, advance, completed: true }
            } else if (relCntTillNotLandscape >= halfSpots) {
                for (let y = 0; y < halfSpots; y++) {
                    t.push(<MediaShow key={`Media-Show-Thumb-${idx + y}`} sizeScale={.25} media={mediaList.value[idx + y]} idx={idx + y} dimensionType={sizingArr[y].enum} />)
                }
                advance = halfSpots
                w.push(
                    <div className="grid w-full h-full" key={`Media-Grid-${idx}`}
                        style={{ "gridTemplateColumns": `repeat(${halfSpots}, minmax(0, 1fr))` }}>
                        {t}
                    </div>
                );
                console.log("AdvanceLSS: " + advance)
                p.push(w);
                return { reactNodes: p, advance, completed: true }
            } else {
                // If it doesn't return by now just throw the maxCols into the grid
                advance = 0;
                for (let y = 0; y < maxCols; y++) {
                    t.push(<MediaShow key={`Media-Show-Thumb-${idx + y}`} sizeScale={.25} media={mediaList.value[idx + y]} idx={idx + y} dimensionType={MediaSizing.square} />)
                    if (idx + y >= mediaList.value.length){
                        advance++;
                    }
                }
                w.push(
                    <div className="grid w-full h-full" key={`Media-Grid-${idx}`}
                        style={{ "gridTemplateColumns": `repeat(${maxCols}, minmax(0, 1fr))` }}>
                        {t}
                    </div>
                );

                p.push(w)
                return { reactNodes: p, advance, completed: advance == maxCols }
            }
        }

        p.push(w)
        return { reactNodes: p, advance, completed: advance == maxCols }
    }

    function mediaGrid(p: (ReactNode | ReactNode[])[]): (ReactNode | ReactNode[])[] {
        useSignals();
        let r: (ReactNode | ReactNode[])[] = p
        for (let i = 0; i < mediaList.value.length; i++) {
            if (!lastCompleted){
                i -= lastAdvance + 1;
                r = r.slice(0, -1)
            }
            let { reactNodes, advance, completed } = gridRec(i, r, maxCols, 1, true);
            r = reactNodes;
            i += advance

            lastAdvance = advance;
            lastCompleted = completed;
        }
        return r;
    }

    return (
        <>
            {mediaGrid([])}
        </>
    )
}

