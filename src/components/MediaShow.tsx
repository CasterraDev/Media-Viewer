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
    onMedia?: (idx: number) => void
    focus?: boolean
}


export default function MediaShow(
    {
    media,
    idx,
    dimensionType,
    sizeScale,
    onMedia,
    focus,
    ...props
    }: MediaShowType & React.ComponentProps<"div">) {
    const [mediaST, _setMediaST] = useState<Media>(media);

    const dynaMedia = (): ReactNode => {
        if (!mediaST) return;
        if (mediaST.mediaType.includes("photos")) {
            return (
                <button className="relative w-full h-fit" onClick={() => { if (onMedia) onMedia(idx) }}>
                    <Image
                        alt={`${media.title || media.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${media.id}`}
                        sizes={sizeScale ? `calc(100vw * ${sizeScale})` : "100vw"}
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
                    className="relative w-full h-fit" onClick={() => { if (onMedia) onMedia(idx) }}>
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
            <div id={`Media-Show-${media.id}`} {...props} className={`MediaShow ${MediaSizing[dimensionType]} w-full h-full ${focus && "border-red-500 border-2"}`}>
                {
                    dynaMedia()
                }
            </div>
        </>
    )
}

