"use client"
import { getAllAlbums } from "@/actions/getAllAlbums";
import { Album, Media } from "@/db/types"
import { useEffect, useState } from "react"
import AlbumThumb from "./AlbumThumb";

import { BsThreeDotsVertical } from "react-icons/bs";
import MediaLoader from "@/components/MediaLoader";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { CreateAlbumAPIPOST } from "@/_types/api";
import { FilterPrimative } from "@/_types/type";
import { createAlbum } from "@/actions/createAlbum"
import { filterTypeToPrimative } from "@/utils/clientUtil";
import { filter } from "@/utils/signals";
import { FormEvent } from "react";

export default function AlbumGrid() {
    const [albums, setAlbums] = useState<(Album & { thumbnail: Media })[]>([]);

    useEffect(() => {
        async function fun() {
            setAlbums(await getAllAlbums())
        }
        fun();
    }, [])

    async function submit(e: FormEvent<HTMLFormElement>){
        console.log(e);
        let fd = new FormData(e.currentTarget);
        console.log(fd)
        let p: Partial<CreateAlbumAPIPOST> = {title: fd.get("title")?.toString(), description: fd.get("description")?.toString()}
        console.log(p);
        await createAlbum(p).then(async () => {
            setAlbums(await getAllAlbums())
        });
    }

    function getFilter(): FilterPrimative {
        const f = filterTypeToPrimative(filter);
        f.media = { photos: true, videos: false };
        f.size = "400000000"
        return f;
    }

    return (
        <div className="grid grid-cols-6 h-fit gap-5">
            <Dialog>
                <form className="w-fit" onSubmit={submit} id="change-album-form">
                    <DialogTrigger asChild>
                        <button className="w-40 h-auto aspect-square border-2 border-dotted border-gray-500 rounded-lg flex align-middle justify-center">
                            <p className="m-auto w-fit h-fit text-gray-500 text-center">+ New Album</p>
                        </button>
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
                                <Input form="change-album-form" id="title" name="title" />
                            </div>
                            <div className="grid gap-3">
                                <label htmlFor="description">Description</label>
                                <Input form="change-album-form" id="description" name="description" />
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className=""><BsThreeDotsVertical /></button>
                            </DialogTrigger>
                            <DialogContent className="max-w-full">
                                <DialogHeader>
                                    <DialogTitle>Select Album Thumbnail</DialogTitle>
                                </DialogHeader>
                                <div className="scroll-auto max-h-[80vh] overflow-scroll">
                                </div>
                            </DialogContent>
                        </Dialog>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button form={"change-album-form"} type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
            {albums.map((x) => (
                <AlbumThumb key={x.id} album={x} />
            ))}
        </div>
    )
}

