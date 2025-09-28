"use client"
import { MediaSizing } from "@/_types/type";
import { Media } from "@/db/types";
import { secsIntoHexidecmal } from "@/utils/clientUtil";
import Image from "next/image";
import { ReactNode, useState } from "react"
import { FaPlay } from "react-icons/fa6";
import { mediaPresentIdx } from "@/utils/signals";

type MediaShowType = {
    media: Media
    idx: number
    dimensionType: MediaSizing
    sizeScale?: number
}

function mediaClick(idx: number) {
    mediaPresentIdx.value = idx;
}

const photoReact = (m: MediaShowType): ReactNode => {
    return (
        <button className="relative w-full h-fit" onClick={() => mediaClick(m.idx)}>
            <Image
                alt={`${m.media.title || m.media.mediaFilename}`}
                src={`/api/getMedia?mediaID=${m.media.id}`}
                sizes={m.sizeScale ? `calc(100vw * ${m.sizeScale})` : "100vw"}
                style={{
                    width: '100%',
                    height: 'auto',
                }}
                width={500}
                height={300}
            />
        </button>
    )
}

export default function MediaShow(props: MediaShowType) {
    const [media, setMedia] = useState<Media>(props.media);

    const dynaMedia = (): ReactNode => {
        if (!media) return;
        if (media.mediaType.includes("photos")) {
            return photoReact(props);
        } else {
            return (
                <button
                    className="relative w-full h-fit" onClick={() => mediaClick(props.idx)}>
                    <video src={`/api/getMedia?mediaID=${media.id}`} />
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <p>{secsIntoHexidecmal(media.mediaDurationInSecs || 0)}</p>
                        <FaPlay className="m-auto" />
                    </div>
                </button>
            )
        }
    }

    return (
        <div id={`Media-Show-${props.idx}`} className={`MediaShow ${MediaSizing[props.dimensionType]} w-full h-full`}>
            {
                dynaMedia()
            }
        </div>
    )
}

