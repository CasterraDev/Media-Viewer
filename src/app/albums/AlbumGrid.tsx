"use client"
import { getAllAlbums } from "@/actions/getAllAlbums";
import { Album } from "@/db/types"
import { useEffect, useState } from "react"
import AlbumThumb from "./AlbumThumb";
import NewAlbum from "./NewAlbum";

export default function AlbumGrid() {
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        async function fun() {
            setAlbums(await getAllAlbums())
        }
        fun();
    }, [])
  return (
    <div className="flex h-fit gap-5">
        {albums.map((x) => (
            <AlbumThumb key={x.id} album={x}/>
        ))}
        <NewAlbum />
    </div>
  )
}

