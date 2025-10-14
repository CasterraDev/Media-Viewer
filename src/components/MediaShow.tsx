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
    onMediaSelect?: (idx: number) => void
    selected?: boolean
    focus?: boolean
}


export default function MediaShow(
    {
        media,
        idx,
        dimensionType,
        sizeScale,
        onMedia,
        onMediaSelect,
        selected,
        focus,
        ...props
    }: MediaShowType & React.ComponentProps<"div">) {
    const [mediaST, _setMediaST] = useState<Media>(media);

    const dynaMedia = (): ReactNode => {
        if (!mediaST) return;
        if (mediaST.mediaType.includes("photos")) {
            return (
                <div className="group relative w-full h-fit">
                    <Image
                        alt={`${media.title || media.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${media.id}`}
                        sizes={sizeScale ? `calc(100vw * ${sizeScale})` : "100vw"}
                        onClick={() => { if (onMedia) onMedia(idx) }}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    />
                    <div className="absolute top-0 left-0 z-10 m-1 flex flex-row gap-1">
                        <div className={`group-hover:block w-4 aspect-square border-2 border-white rounded-sm ${selected ? "bg-white" : "hidden"}`}
                            onClick={() => { if (onMediaSelect) onMediaSelect(idx) }} />
                    </div>
                </div>
            )
        } else {
            return (
                <div
                    className="group relative w-full h-fit">
                    <video preload="metadata" playsInline={true} onClick={() => { if (onMedia) onMedia(idx) }}>
                        <source src={`/api/getMedia?mediaID=${media.id}`} />
                    </video>
                    <div className="absolute top-0 left-0 z-10 m-1 flex flex-row gap-1">
                        <div className={`group-hover:block hidden w-4 aspect-square border-2 border-white rounded-sm ${selected && "bg-white block"}`}
                            onClick={() => { if (onMediaSelect) onMediaSelect(idx) }} />
                    </div>
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <p>{secsIntoHexidecmal(media.mediaDurationInSecs || 0)}</p>
                        <FaPlay className="m-auto" />
                    </div>
                </div>
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

