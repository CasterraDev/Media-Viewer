"use client"

import { createAlbum } from "@/actions/createAlbum"

export default function NewAlbum() {
    async function click() {
        const res = await createAlbum({});
    }

    return (
        <button onClick={click} className="w-40 h-auto aspect-square border-2 border-dotted border-gray-500 rounded-lg flex align-middle justify-center">
            <p className="m-auto w-fit h-fit text-gray-500 text-center">+ New Album</p>
        </button>
    )
}

