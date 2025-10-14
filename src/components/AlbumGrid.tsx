"use client"
import { getAllAlbums } from "@/actions/getAllAlbums";
import { Album, InferQueryModel, Media } from "@/db/types"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { CreateAlbumAPIPOST } from "@/_types/api";
import { createAlbum } from "@/actions/createAlbum"
import { FormEvent } from "react";
import AlbumChangeForm from "./AlbumChangeForm";
import AlbumThumb from "./AlbumThumb";

export default function AlbumGrid() {
    const [albums, setAlbums] = useState<InferQueryModel<"album", { with: { thumbnail: true } }>[]>([]);
    const [newAlbumOpen, setNewAlbumOpen] = useState<boolean>(false)

    useEffect(() => {
        async function fun() {
            setAlbums(await getAllAlbums())
        }
        fun();
    }, [])

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let fd = new FormData(e.currentTarget);
        let p: Partial<CreateAlbumAPIPOST> = { title: fd.get("title")?.toString(), description: fd.get("description")?.toString(), thumbnailID: fd.get("thumbnailID")?.toString() }
        await createAlbum(p).then(async () => {
            setAlbums(await getAllAlbums())
            setNewAlbumOpen(false);
        });
    }

    return (
        <div className="grid grid-cols-6 h-fit gap-5">
            <Dialog open={newAlbumOpen} onOpenChange={setNewAlbumOpen}>
                <DialogTrigger asChild>
                    <button className="w-40 h-auto aspect-square border-2 border-dotted border-gray-300 rounded-lg flex align-middle justify-center">
                        <p className="m-auto w-fit h-fit text-gray-300 text-center">+ New Album</p>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={submit} id="create-album-form">
                        <DialogHeader>
                            <DialogTitle>Create Album</DialogTitle>
                            <DialogDescription>
                                Create an ablum here
                            </DialogDescription>
                        </DialogHeader>
                        <AlbumChangeForm formID="create-album-form" />
                    </form>
                </DialogContent>
            </Dialog>
            {albums.map((x, i) => (
                <AlbumThumb key={`${x.title || "Title"} + ${x.description} + ${x.id} + ${i}`} curAlbum={x} />
            ))}
        </div>
    )
}

