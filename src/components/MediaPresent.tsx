"use client"

import { mediaList, mediaPresentIdx } from "@/utils/signals"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { FaInfo, FaPlay, FaX } from "react-icons/fa6"
import { Album, Media, MediaAlbums } from "@/db/types"
import Image from "next/image";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { MdOutlineLoop } from "react-icons/md";
import useUserPrefs from "@/hooks/useUserPrefs"
import { getMediaSizing } from "@/utils/clientUtil"
import { MediaSizing } from "@/_types/type"
import { GoFileDirectory } from "react-icons/go";
import { FaRegFile } from "react-icons/fa6";
import { FaRegImage } from "react-icons/fa";
import Link from "next/link"
import { setMediasToAlbum } from "@/actions/setMediasToAlbum"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { RiExpandUpDownLine } from "react-icons/ri";
import { useRouter } from "next/navigation"
import { LuAlbum } from "react-icons/lu";
import AlbumCommand from "./AlbumCommand"

function close() {
    document.body.classList.remove("overflow-x-hidden")
    document.body.classList.remove("overflow-y-hidden")
    mediaPresentIdx.value = null
}

export default function MediaPresent({ mediaAlbums, mediaIdx, allAlbums, ...props }: { mediaAlbums: MediaAlbums, mediaIdx: number, allAlbums?: Album[] } & React.ComponentProps<"div">) {
    const [media, setmedia] = useState<MediaAlbums>(mediaAlbums);
    console.log(mediaAlbums);
    const { userPrefs, updateUserPrefs } = useUserPrefs("settings");
    const [albumComboboxOpen, setAlbumComboboxOpen] = useState<boolean>(false);
    const [info, setInfo] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(userPrefs.mediaLoop);
    const [autoplay, setAutoplay] = useState<boolean>(userPrefs.mediaAutoplay);
    const [hideControls, setHideControls] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);
    const [albumAddStatusDisabled, setAlbumAddStatusDisabled] = useState<boolean>(false);
    const router = useRouter();

    function changeMedia(side: number, idx: number) {
        if ((side == -1 || !side) && idx > 0) {
            mediaPresentIdx.value = idx - 1;
        } else {
            if (idx < mediaList.value.length - 1) {
                mediaPresentIdx.value = idx + 1;
            }
        }
        document.getElementById(`Media-Show-${media.id}`)?.scrollIntoView();
    }

    const dynaMedia = (m: Media): ReactNode => {
        if (!m) return;
        const sizing = getMediaSizing(m.mediaWidth, m.mediaHeight);
        if (m.mediaType.includes("photos")) {
            return (
                <div ref={ref} className="w-full h-full flex items-center z-0" {...props}>
                    <Image
                        alt={`${m.title || m.mediaFilename}`}
                        src={`/api/getMedia?mediaID=${m.id}`}
                        unoptimized
                        style={{
                            width: sizing == MediaSizing.portrait ? "auto" : sizing == MediaSizing.landscape ? `fit-content` : "auto",
                            height: sizing == MediaSizing.portrait ? "100%" : sizing == MediaSizing.landscape ? "auto" : "100%",
                            objectFit: "contain",
                            maxHeight: "100%",
                            maxWidth: "100%"
                        }}
                        width={3000}
                        height={2000}
                        className={`mx-auto z-0`}
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
        } else if (e.code == 'KeyH') {
            setHideControls(prev => !prev);
        } else if (e.code == 'KeyI') {
            setInfo(prev => !prev);
        }
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

    async function addMediaToAlbum(id: string) {
        setAlbumAddStatusDisabled(true);
        await setMediasToAlbum(id, [media.id]).finally(() => {
            setAlbumAddStatusDisabled(false);
            router.refresh();
        });
    }

    return (
        <div className="fixed w-[100vw] h-[100vh] bg-black/50 z-50 top-0 left-0 right-0 backdrop-blur-sm bottom-0">
            {!hideControls &&
                <div className="absolute w-full h-15 flex flex-row-reverse items-center gap-4 px-4 z-50!">
                    <>
                        <Button className="hover:bg-secondary" variant={"secondary"} onClick={close}><FaX /></Button>
                        <Button variant={"secondary"} className="" onClick={() => setInfo(!info)}>
                            <FaInfo className={`w-full h-auto ${info ? "text-site-accent" : ""}`} />
                        </Button>
                        <Button variant={"secondary"} className="" onClick={() => setLoop(!loop)}>
                            <MdOutlineLoop className={`w-full h-auto ${loop ? "text-site-accent" : ""}`} />
                        </Button>
                        <Button variant={"secondary"} className="" onClick={() => setAutoplay(!autoplay)}>
                            <FaPlay className={`w-full h-auto ${autoplay ? "text-site-accent" : ""}`} />
                        </Button>
                    </>
                </div>
            }
            {info &&
                <div className="absolute top-0 right-0 mt-15 w-90 h-[100vh] z-50 bg-background">
                    <div className="flex flex-col gap-3 p-2 pl-5">
                        <div className="flex flex-row gap-2">
                            {media.title}
                        </div>
                        <div className="flex flex-row gap-2">
                            <FaRegFile className={`w-auto h-full my-auto min-w-5`} />
                            <Link href={`/api/getMedia?mediaID=${media.id}`} rel="noopener noreferrer" target="_blank">
                                {media.mediaFilename}
                            </Link>
                        </div>
                        <div className="flex flex-row gap-2">
                            <FaRegImage className={`w-auto h-full my-auto min-w-5`} />
                            {media.mediaWidth} x {media.mediaHeight}
                        </div>
                        <div className="flex flex-row gap-2">
                            <GoFileDirectory className={`w-auto h-full min-w-6`} />
                            {media.mediaFilePath}
                        </div>
                    </div>
                    <div className="pl-5">
                        {media.albums.length > 0 && media.albums.map((albums) => {
                            let a = albums.album;
                            return (
                                <p className="flex flex-row gap-2" key={"Album-Present-Title-" + a.title + a.id}><LuAlbum className="w-auto h-auto" />{a.title}</p>
                            )
                        })}
                        <AlbumCommand onlyTitle={true} onAlbumSelect={(a) => addMediaToAlbum(a.id)} listClassname="grid grid-cols-1" contentClassname="w-[10rem] p-1 max-h-[40rem] overflow-auto"/>
                    </div>
                </div>
            }
            <div className="w-full h-full p-10 py-0">
                <button onClick={() => changeMedia(-1, mediaIdx)} className="fixed top-1/2 left-0 pl-2 w-10 aspect-square"><IoIosArrowDropleft className="w-full h-full hover:text-site-accent" /></button>
                {dynaMedia(media)}
                <button onClick={() => changeMedia(1, mediaIdx)} className="fixed top-1/2 right-0 pr-2 w-10 aspect-square"><IoIosArrowDropright className="w-full h-full hover:text-site-accent" /></button>
            </div>
        </div>
    )
}

