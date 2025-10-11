"use client"

import { CreateAlbumAPIPOST } from "@/_types/api";
import { FilterPrimative } from "@/_types/type";
import { createAlbum } from "@/actions/createAlbum"
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
import { filterTypeToPrimative } from "@/utils/clientUtil";
import { filter } from "@/utils/signals";
import { FormEvent } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function NewAlbum() {
    async function click(form: FormEvent<HTMLFormElement>) {
        let fd = new FormData(form.currentTarget)
        let p: Partial<CreateAlbumAPIPOST> = { title: fd.get("title")?.toString() || "", description: fd.get("description")?.toString() || "" }
        const res = await createAlbum(p);
    }

    function getFilter(): FilterPrimative {
        const f = filterTypeToPrimative(filter);
        f.media = { photos: true, videos: false };
        f.size = "400000000"
        return f;
    }

    return (
        <Dialog>
            <form className="w-fit" onSubmit={click} id="change-album-form">
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
                                <MediaLoader reset={true} filter={getFilter()} />
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
    )
}

