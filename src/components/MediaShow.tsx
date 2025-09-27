"use client"
import { MediaSizing } from "@/_types/type";
import { Media } from "@/db/types";
import { secsIntoHexidecmal } from "@/utils/clientUtil";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa6";

type MediaShowType = {
    media: Media
    dimensionType: MediaSizing
    sizeScale?: number
}

const photoReact = (m: MediaShowType): ReactNode => {
    return (
        <div className="relative w-full h-fit">
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
        </div>
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
                <div className="w-fit h-fit relative">
                    <video src={`/api/getMedia?mediaID=${media.id}`} />
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <p>{secsIntoHexidecmal(media.mediaDurationInSecs || 0)}</p>
                        <FaPlay className="m-auto"/>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className={`${MediaSizing[props.dimensionType]} w-full h-full`}>
            {
                dynaMedia()
            }
        </div>
    )
}

