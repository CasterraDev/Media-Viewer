"use client"
import { MediaSizing } from "@/_types/type";
import { Media } from "@/db/types";
import { secsIntoHexidecmal } from "@/utils/clientUtil";
import Image from "next/image";
import { ReactNode, useState } from "react"
import { FaPlay } from "react-icons/fa6";

type MediaShowType = {
    media: Media
    idx: number
    dimensionType: MediaSizing
    sizeScale?: number
    onClick?: (idx: number) => void
}


export default function MediaShow(props: MediaShowType) {
    const [media, _setMedia] = useState<Media>(props.media);

    const dynaMedia = (): ReactNode => {
        if (!media) return;
        if (media.mediaType.includes("photos")) {
            return (
                <button className="relative w-full h-fit" onClick={() => {if (props.onClick) props.onClick(props.idx)}}>
                    <Image
                        alt={`${media.title || media.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${media.id}`}
                        sizes={props.sizeScale ? `calc(100vw * ${props.sizeScale})` : "100vw"}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    />
                </button>
            )
        } else {
            return (
                <button
                    className="relative w-full h-fit" onClick={() => {if (props.onClick) props.onClick(props.idx)}}>
                    <video preload="metadata" playsInline={true}>
                        <source src={`/api/getMedia?mediaID=${media.id}`} />
                    </video>
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <p>{secsIntoHexidecmal(media.mediaDurationInSecs || 0)}</p>
                        <FaPlay className="m-auto" />
                    </div>
                </button>
            )
        }
    }

    return (
        <>
            <div id={`Media-Show-${props.idx}`} className={`MediaShow ${MediaSizing[props.dimensionType]} w-full h-full`}>
                {
                    dynaMedia()
                }
            </div>
        </>
    )
}

