"use client"

import { mediaList, mediaPresentIdx } from "@/utils/signals"
import { ReactNode, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { FaPlay, FaX } from "react-icons/fa6"
import { Media } from "@/db/types"
import Image from "next/image";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { MdOutlineLoop } from "react-icons/md";
import useUserPrefs from "@/hooks/useUserPrefs"
import { getMediaSizing } from "@/utils/clientUtil"
import { MediaSizing } from "@/_types/type"

function close() {
    document.body.classList.remove("overflow-x-hidden")
    document.body.classList.remove("overflow-y-hidden")
    mediaPresentIdx.value = null
}


export default function MediaPresent({ media, mediaIdx }: { media: Media, mediaIdx: number }) {
    let m = media
    const { userPrefs, updateUserPrefs } = useUserPrefs("settings");
    const [loop, setLoop] = useState<boolean>(userPrefs.mediaLoop);
    const [autoplay, setAutoplay] = useState<boolean>(userPrefs.mediaAutoplay);

    function changeMedia(side: number, idx: number) {
        if ((side == -1 || !side) && idx > 0) {
            mediaPresentIdx.value = idx - 1;
        } else {
            if (idx < mediaList.value.length - 1) {
                mediaPresentIdx.value = idx + 1;
            }
        }
        document.getElementById(`Media-Show-${mediaPresentIdx}`)?.scrollIntoView();
    }

    const dynaMedia = (m: Media): ReactNode => {
        if (!m) return;
        const sizing = getMediaSizing(m.mediaWidth, m.mediaHeight);
        if (m.mediaType.includes("photos")) {
            return (
                <div className="w-full h-full flex items-center">
                    <Image
                        alt={`${m.title || m.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${m.id}`}
                        sizes={"100vw"}
                        style={{
                            width: sizing == MediaSizing.portrait ? "auto" : sizing == MediaSizing.landscape ? "100%" : "auto",
                            height: sizing == MediaSizing.portrait ? "100%" : sizing == MediaSizing.landscape ? "auto" : "100%",
                        }}
                        width={500}
                        height={300}
                        className="mx-auto"
                        quality={100}
                    />
                </div>
            )
        } else {
            return (
                <div className="w-auto h-full">
                    <video autoPlay={autoplay} loop={loop} className="w-auto h-full mx-auto" controls src={`/api/getMedia?mediaID=${m.id}`} />
                </div>
            )
        }
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.code == 'Escape' || e.code == 'ControlRight') {
            close()
        } else if (e.code == 'ArrowRight') {
            if (mediaPresentIdx.value != null) {
                changeMedia(1, mediaPresentIdx.value)
            }
        } else if (e.code == 'ArrowLeft') {
            if (mediaPresentIdx.value != null) {
                changeMedia(-1, mediaPresentIdx.value)
            }
        } else if (e.code == 'KeyL') {
            setLoop(prev => !prev);
        } else if (e.code == 'KeyO' || e.code == 'KeyR') {
            setAutoplay(prev => !prev);
        }
        console.log(e.code)
    }

    useEffect(() => {
        document.body.classList.add("overflow-x-hidden")
        document.body.classList.add("overflow-y-hidden")
        document.addEventListener("keydown", keyDownHandler);

        // clean up
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [])

    useEffect(() => {
        updateUserPrefs({ mediaLoop: loop, mediaAutoplay: autoplay })
    }, [loop, autoplay])

    return (
        <div className="fixed w-[100vw] h-[100vh] bg-black/50 z-50 top-0 left-0 right-0 backdrop-blur-sm bottom-0">
            <div className="w-full h-15 flex flex-row-reverse items-center gap-4 px-4">
                <Button className="hover:bg-secondary" variant={"secondary"} onClick={close}><FaX /></Button>
                <Button variant={"ghost"} className="" onClick={() => setLoop(!loop)}>
                    <MdOutlineLoop className={`w-full h-auto ${loop ? "text-site-accent" : ""}`} />
                </Button>
                <Button variant={"ghost"} className="" onClick={() => setAutoplay(!autoplay)}>
                    <FaPlay className={`w-full h-auto ${autoplay ? "text-site-accent" : ""}`} />
                </Button>
            </div>
            <div className="w-full h-[calc(100%_-_(var(--spacing)_*_15))] p-10 pt-0">
                <button onClick={() => changeMedia(-1, mediaIdx)} className="fixed top-1/2 left-0 pl-2 w-10 aspect-square"><IoIosArrowDropleft className="w-full h-full hover:text-site-accent" /></button>
                {dynaMedia(m)}
                <button onClick={() => changeMedia(1, mediaIdx)} className="fixed top-1/2 right-0 pr-2 w-10 aspect-square"><IoIosArrowDropright className="w-full h-full hover:text-site-accent" /></button>
            </div>
        </div>
    )
}

