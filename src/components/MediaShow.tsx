"use client"
import { Media } from "@/db/types";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react"

type MediaShowType = {
    media: Media
}

export default function MediaShow(props: MediaShowType) {
    const [media, setMedia] = useState<Media>(props.media);

    const dynaMedia = (): ReactNode => {
        if (!media) return;
        if (media.mediaType.includes("image")) {
            return (
                <div className="relative">
                    <img
                        alt={`${media.title || media.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${media.id}`}
                    />
                </div>
            )
        } else {
            return <video
                controls
                src={`/api/getMedia?mediaID=${media.id}`}
            />
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

