"use client"
import { Media } from "@/db/types";
import { ReactNode, useEffect, useState } from "react"

type MediaShowType = {
    media: Media
}

export default function MediaShow(props: MediaShowType) {
    const [media, setMedia] = useState<Media>(props.media);

    const dynaMedia = (): ReactNode => {
        if (!media) return;
        if (media.mediaType.includes("image")) {
            return <img
                src={`/api/getMedia?mediaID=${media.id}`}
            />
        } else {
            return <video
                controls
                src={`/api/getMedia?mediaID=${media.id}`}
            />
        }
    }

    return (
        <div>
            {
                dynaMedia()
            }
        </div>
    )
}

