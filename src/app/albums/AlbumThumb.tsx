"use client"

import Image from "next/image";
import { getMedia } from "@/actions/getMedia"
import { Album, Media } from "@/db/types"
import { ReactNode, useEffect, useState } from "react"
import { secsIntoHexidecmal } from "@/utils/clientUtil";
import { FaPlay } from "react-icons/fa6";
import { useSignals } from "@preact/signals-react/runtime";
import Link from "next/link";

type AlbumThumbProps = {
    album: Album & { thumbnail: Media }
}

export default function AlbumThumb(props: AlbumThumbProps) {
    const [media, setMedia] = useState<Media | null>(null)
    useSignals();

    useEffect(() => {
        async function fun() {
            if (props.album?.thumbnail?.id) {
                let m = await getMedia(props.album.thumbnail.id)
                console.log(m);
            }
        }
        fun()
    }, [])

    const dynaMedia = (): ReactNode => {
        if (!media) return;
        if (media.mediaType.includes("photos")) {
            return (
                <Image
                    alt={`${media.title || media.mediaFilename}`}
                    src={`/api/getMedia?mediaID=${media.id}`}
                    sizes={`calc(100vw * ${.5})`}
                    objectFit="cover"
                />
            )
        } else {
            return (
                <>
                    <video preload="metadata">
                        <source src={`/api/getMedia?mediaID=${media.id}`} />
                    </video>
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <p>{secsIntoHexidecmal(media.mediaDurationInSecs || 0)}</p>
                        <FaPlay className="m-auto" />
                    </div>
                </>
            )
        }
    }

    return (
        <div className="group flex flex-col w-fit h-fit">
            <div className="relative w-40 h-fit">
                <Link href={`/albums/${props.album.id}`}>
                    <div className="w-full h-40 border-2 border-gray-500 rounded-lg shadow-accent shadow-[6px_6px]">
                        {media && media != null &&
                            dynaMedia()
                        }
                    </div>
                </Link>
                <input className="w-40 text-foreground" name="title" type="text" placeholder="Title" defaultValue={props.album?.title || ""} />
            </div>
        </div>
    )
}

