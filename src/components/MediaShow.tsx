"use client"
import { Media } from "@/db/types";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa6";

type MediaShowType = {
    media: Media
    dimensionType: "square" | "landscape" | "portrait"
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
                    <FaPlay className="absolute top-0 right-0 z-10 m-1" />
                </div>
            )
        }
    }

    return (
        <div className="w-full h-full">
            {
                dynaMedia()
            }
        </div>
    )
}

