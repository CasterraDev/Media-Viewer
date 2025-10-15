"use client"

import Image from "next/image";
import { InferQueryModel } from "@/db/types"
import { FormEvent, Suspense } from "react"
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BsThreeDotsVertical } from "react-icons/bs";
import Loading from "@/components/Loading";
import { changeAlbum } from "@/actions/changeAlbum";
import AlbumChangeForm from "@/app/albums/AlbumChangeForm";

type AlbumThumbProps = {
    curAlbum: InferQueryModel<"album", { with: { thumbnail: true } }>
}

export default function AlbumThumb({ curAlbum }: AlbumThumbProps) {
    const submitChangeForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let fd = new FormData(e.currentTarget);
        let id = fd.get("albumID");
        if (!id) return;
        let a = {
            albumID: id.toString(),
            title: fd.get("title")?.toString() || undefined,
            description: fd.get("description")?.toString() || undefined,
            thumbnailID: fd.get("thumbnailID")?.toString() || undefined
        }
        await changeAlbum(a).then(() => {
            location.reload();
        });
    }

    return (
        <div className="group flex flex-col w-fit h-fit">
            <div className="relative w-40 h-fit">
                <div className="absolute top-0 right-0">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="group-hover:block hidden p-1">
                                <BsThreeDotsVertical />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={submitChangeForm} id="change-album-form">
                                <DialogHeader>
                                    <DialogTitle>Edit Album</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your album here.
                                    </DialogDescription>
                                </DialogHeader>
                                <AlbumChangeForm formID="change-album-form" album={curAlbum} />
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Link href={`/albums/${curAlbum.id}`}>
                    <div className="w-auto h-(--albumThumbnailHeight) aspect-square border-2 border-gray-500 rounded-lg shadow-accent shadow-[6px_6px] overflow-hidden">
                        {curAlbum.thumbnailID ?
                            <Suspense fallback={<Loading />}>
                                <Image
                                    alt={`${curAlbum.title}'s Thumbnail`}
                                    src={`/api/getMedia?mediaID=${curAlbum.thumbnailID}`}
                                    sizes={`calc(100vw * ${.2})`}
                                    style={{
                                        objectFit: "fill",
                                    }}
                                    width={500}
                                    height={300}
                                />
                            </Suspense>
                            :
                            <></>
                        }
                    </div>
                </Link>
                <p className="w-40 text-foreground pt-1">{curAlbum.title}</p>
            </div>
        </div>
    )
}

