"use client"

import Image from "next/image";
import { getMedia, getMedias } from "@/actions/getMedia"
import MediaShow from "@/components/MediaShow"
import { Album, Media } from "@/db/types"
import { FormEvent, ReactNode, Suspense, useEffect, useState } from "react"
import { filterTypeToPrimative, secsIntoHexidecmal } from "@/utils/clientUtil";
import { FaPlay } from "react-icons/fa6";
import { filter, mediaList, mediaNotFinished, mediaOffset } from "@/utils/signals"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Filter, FilterPrimative, MediaSizing } from "@/_types/type";
import { useSignals } from "@preact/signals-react/runtime";
import { useInView } from "react-intersection-observer";
import { Show } from "@preact/signals-react/utils";
import { changeAlbum } from "@/actions/changeAlbum";
import MediaLoader from "@/components/MediaLoader";

type AlbumThumbProps = {
    album: Album & { thumbnail: Media }
}

export default function AlbumThumb(props: AlbumThumbProps) {
    const [media, setMedia] = useState<Media | null>(null)
    useSignals();
    const { ref, inView } = useInView()
    const maxCols = 4

    async function loadMoreMedias() {
        const f = filterTypeToPrimative(filter);
        f.media = { photos: true, videos: false };
        f.size = "400000000"
        const apiMedias = await getMedias(mediaOffset.value, 10, f)
        console.log("apiMedias: " + apiMedias)
        if (apiMedias.length <= 0) {
            mediaNotFinished.value = false
            return
        }
        mediaList.value = [...mediaList.value, ...apiMedias]
        mediaOffset.value = mediaOffset.value + 10
    }

    useEffect(() => {
        if (inView && mediaNotFinished.value) {
            loadMoreMedias()
        }
    }, [inView])

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
                <button className="w-full h-40 border-2 border-gray-500 rounded-lg shadow-accent shadow-[6px_6px]">
                    {media && media != null &&
                        dynaMedia()
                    }
                </button>
                <input className="w-40" name="title" type="text" placeholder="Title" defaultValue={props.album?.title || ""} />
            </div>
        </div>
    )
}

