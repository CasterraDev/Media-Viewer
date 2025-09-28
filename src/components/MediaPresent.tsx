"use client"

import { mediaList, mediaPresentIdx } from "@/utils/signals"
import { ReactNode, useEffect } from "react"
import { Button } from "./ui/button"
import { FaX } from "react-icons/fa6"
import { Media } from "@/db/types"
import Image from "next/image";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";


function close() {
    document.body.classList.remove("overflow-x-hidden")
    document.body.classList.remove("overflow-y-hidden")
    mediaPresentIdx.value = null
}

function keyDownHandler(e: KeyboardEvent) {
    if (e.code == 'Escape') {
        close()
    }
}

const dynaMedia = (m: Media): ReactNode => {
    if (!m) return;
    if (m.mediaType.includes("photos")) {
        return (
            <div className="w-full h-full">
                <Image
                    alt={`${m.title || m.mediaFilename}`}
                    src={`/api/getMedia?mediaID=${m.id}`}
                    sizes={"100vw"}
                    style={{
                        width: 'auto',
                        height: '100%',
                    }}
                    width={500}
                    height={300}
                    className="mx-auto"
                />
            </div>
        )
    } else {
        return (
            <div className="w-auto h-full">
                <video className="w-auto h-full mx-auto" controls src={`/api/getMedia?mediaID=${m.id}`} />
            </div>
        )
    }
}

function changeMedia(side: number, idx: number) {
    if ((side == -1 || !side) && idx > 0) {
        mediaPresentIdx.value = idx - 1;
    } else {
        if (idx < mediaList.value.length) {
            mediaPresentIdx.value = idx + 1;
        }
    }
}

export default function MediaPresent({ mediaIdx }: { mediaIdx: number }) {
    let m = mediaList.value[mediaIdx]

    useEffect(() => {
        document.body.classList.add("overflow-x-hidden")
        document.body.classList.add("overflow-y-hidden")
        document.addEventListener("keydown", keyDownHandler);

        // clean up
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [])

    return (
        <div className="fixed w-[100vw] h-[100vh] bg-black/50 z-50 top-0 left-0 right-0 backdrop-blur-sm bottom-0">
            <div className="w-full h-15 flex flex-row-reverse items-center gap-4 px-4">
                <div className="">
                    <Button className="hover:bg-secondary" variant={"secondary"} onClick={close}><FaX /></Button>
                </div>
            </div>
            <div className="w-full h-[calc(100%_-_(var(--spacing)_*_15))] p-10 pt-0">
                <button onClick={() => changeMedia(-1, mediaIdx)} className="fixed top-1/2 left-0 pl-2 w-10 aspect-square"><IoIosArrowDropleft className="w-full h-full hover:text-site-accent" /></button>
                {dynaMedia(m)}
                <button onClick={() => changeMedia(1, mediaIdx)} className="fixed top-1/2 right-0 pr-2 w-10 aspect-square"><IoIosArrowDropright className="w-full h-full hover:text-site-accent" /></button>
            </div>
        </div>
    )
}

