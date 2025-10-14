"use client"
import { FilterPrimative } from "@/_types/type";
import { getMedias } from "@/actions/getMedia";
import MediaLoader from "@/components/MediaLoader";
import Search from "@/components/Search";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Album } from "@/db/types";
import { filterTypeToPrimative, getDefaultFilterPrimative } from "@/utils/clientUtil";
import { filterSignal, mediaList, mediaNotFinished, mediaOffset } from "@/utils/signals";
import { Suspense, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import Loading from "@/components/Loading";

export default function AlbumChangeForm({ formID, album }: { formID: string, album?: Album }) {
    const [thumbnailID, setThumbnailID] = useState<string | null>(null);
    const [thumbnailOpen, setThumbnailOpen] = useState<boolean>(false);

    async function loadMedia() {
        let f;
        let mediaCnt = 10;
        f = filterTypeToPrimative(filterSignal);
        f.size = "100000"
        f.media = { photos: true, videos: false }
        const apiMedias = await getMedias(mediaOffset.value, mediaCnt, f)
        console.log(apiMedias)
        if (apiMedias.length <= 0) {
            mediaNotFinished.value = false;
            return
        }
        mediaList.value = [...mediaList.value, ...apiMedias];
        mediaOffset.value += mediaCnt;
    }

    function mediaClick(idx: number) {
        setThumbnailID(mediaList.value[idx].id);
        setThumbnailOpen(false);
    }
    // <Dialog open={thumbnailOpen} onOpenChange={setThumbnailOpen}>
    //     <DialogTrigger asChild>
    //         <Button size={"sm"}>Change</Button>
    //     </DialogTrigger>
    //     <DialogContent className="max-w-full">
    //         <DialogHeader>
    //             <DialogTitle>Select Album Thumbnail</DialogTitle>
    //         </DialogHeader>
    //         <div className="scroll-auto max-h-[80vh] overflow-scroll">
    //             <Search />
    //             <MediaLoader reset={true} loadMoreMedia={loadMedia} mediaClick={mediaClick} />
    //         </div>
    //     </DialogContent>
    // </Dialog>

    return (
            <div className="grid gap-4 w-full">
                <div className="grid gap-3">
                    <label htmlFor="title">Title</label>
                    <Input form={formID} id="title" name="title" defaultValue={album?.title || ""} />
                </div>
                <div className="grid gap-3">
                    <label htmlFor="description">Description</label>
                    <Input form={formID} id="description" name="description" defaultValue={album?.description || ""} />
                </div>
                {album &&
                    <input form={formID} hidden id="albumID" name="albumID" value={album.id} readOnly />
                }
                <div className="grid gap-3">
                    <div className="flex flex-row gap-3">
                        <h2>Thumbnail</h2>
                        <input form={formID} id="thumbnailID" name="thumbnailID" hidden value={thumbnailID || undefined} />
                        <Dialog open={thumbnailOpen} onOpenChange={setThumbnailOpen}>
                            <DialogTrigger asChild>
                                <Button size={"sm"}>Change</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-full">
                                <DialogHeader>
                                    <DialogTitle>Select Album Thumbnail</DialogTitle>
                                </DialogHeader>
                                <div className="scroll-auto max-h-[80vh] overflow-scroll">
                                    <Search />
                                    <MediaLoader reset={true} loadMoreMedia={loadMedia} mediaClick={mediaClick} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {(thumbnailID || album?.thumbnailID) &&
                        <div className="w-auto h-(--albumThumbnailHeight) aspect-square border-2 border-gray-500 rounded-lg shadow-accent shadow-[6px_6px] overflow-hidden">
                            <Suspense fallback={<Loading />}>
                                <Image
                                    alt={`Thumbnail`}
                                    src={`/api/getMedia?mediaID=${thumbnailID || album?.thumbnailID}`}
                                    sizes={`calc(100vw * ${.1})`}
                                    style={{
                                        objectFit: "fill",
                                    }}
                                    width={500}
                                    height={300}
                                />
                            </Suspense>
                        </div>
                    }
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button form={formID} type="submit">Save changes</Button>
                </DialogFooter>
            </div>
    )
}

