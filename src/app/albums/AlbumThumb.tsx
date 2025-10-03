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
import { MediaSizing } from "@/_types/type";
import { useSignals } from "@preact/signals-react/runtime";
import { useInView } from "react-intersection-observer";
import { Show } from "@preact/signals-react/utils";

type AlbumThumbProps = {
    album: Album & { thumbnail: Media }
}

export default function AlbumThumb(props: AlbumThumbProps) {
    const [media, setMedia] = useState<Media | null>(null)
    useSignals();
    const { ref, inView } = useInView()
    console.log("MediaScroll")
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

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
    }

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
            <div className="relative w-40 h-40">
                <Dialog>
                    <form className="w-fit absolute top-2 right-2">
                        <DialogTrigger asChild>
                            <button className="group-hover:block hidden z-10"><BsThreeDotsVertical /></button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Album</DialogTitle>
                                <DialogDescription>
                                    Make changes to your album here.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <label htmlFor="title">Title</label>
                                    <Input id="title" name="title" defaultValue={props.album.title || ""} />
                                </div>
                                <div className="grid gap-3">
                                    <label htmlFor="description">Description</label>
                                    <Input id="description" name="description" defaultValue={props.album.description || ""} />
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className=""><BsThreeDotsVertical /></button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Select Album Thumbnail</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 scroll-auto max-h-[80vh]">
                                        <div className="grid gap-3">
                                            <label htmlFor="thumbnail">Media Thumbnail Src</label>
                                            <Input id="thumbnail" name="thumbnail" defaultValue={props.album?.thumbnail?.mediaFilePath || ""} />
                                        </div>
                                        <div className="grid w-full h-fit grid-cols-2 max-h-4/5 overflow-scroll">
                                            {mediaList.value.map((m, i) => (
                                                <div key={m.id}>
                                                    <Suspense>
                                                        <MediaShow sizeScale={.05} media={m} idx={i} dimensionType={MediaSizing.portrait} />
                                                    </Suspense>
                                                </div>
                                            ))}
                                            <Show when={mediaNotFinished}>
                                                <div className="flex flex-col justify-center mt-20 gap-3">
                                                    <div ref={ref} className="w-fit mx-auto p-5 border-1 rounded-lg">Loading...</div>
                                                    <Button onClick={loadMoreMedias} className="w-fit mx-auto p-5 border-1 rounded-lg">Load More</Button>
                                                </div>
                                            </Show>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
                <button className="w-full h-full border-2 border-gray-500 rounded-lg shadow-accent shadow-[6px_6px]">
                    {media && media != null &&
                        dynaMedia()
                    }
                </button>
                <form onSubmit={submit}>
                    <input className="w-40" name="title" type="text" placeholder="Title" defaultValue={props.album?.title || ""} />
                </form>
            </div>
        </div>
    )
}

