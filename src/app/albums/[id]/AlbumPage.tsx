"use client"

import { FilterPrimative } from "@/_types/type";
import { getAlbum } from "@/actions/getAlbum";
import { getMedias } from "@/actions/getMedia";
import MediaLoader from "@/components/MediaLoader";
import { InferQueryModel } from "@/db/types";
import { convertSignalToPrimative } from "@/utils/clientUtil";
import { filterSignal, mediaList, mediaNotFinished, mediaOffset } from "@/utils/signals";
import { useEffect, useState } from "react";

export default function AlbumPage({ id }: { id: string }) {
    const [album, setAlbum] = useState<InferQueryModel<"album", {with: {thumbnail: true, medias: {with:{media: true}}}}>>();

    useEffect(() => {
        async function fun() {
            setAlbum(await getAlbum(id, true, true))
        }
        fun();
    }, [])

    async function loadMoreMedias() {
        let f;
        let mediaCnt = 10;
        f = convertSignalToPrimative(filterSignal) as FilterPrimative;
        f.albums = [id]
        const apiMedias = await getMedias(mediaOffset.value, mediaCnt, f)
        console.log(apiMedias)
        if (apiMedias.length <= 0) {
            mediaNotFinished.value = false;
            return
        }
        mediaList.value = [...mediaList.value, ...apiMedias];
        mediaOffset.value += mediaCnt;
    }

    return (
        <div className="p-4">
            <h1 className="text-4xl">{album?.title}</h1>
            <MediaLoader reset={true} loadMoreMedia={loadMoreMedias} sizeScale={.20} selectable={true}/>
        </div>
    )
}

