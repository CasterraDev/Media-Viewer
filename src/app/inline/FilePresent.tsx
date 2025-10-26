"use client"

import { ReactNode, useEffect, useState } from "react"
import { FaPlay, FaX } from "react-icons/fa6"
import Image from "next/image";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import { MdOutlineLoop } from "react-icons/md";
import useUserPrefs from "@/hooks/useUserPrefs"
import { getMediaSizing } from "@/utils/clientUtil"
import { FileData, MediaSizing } from "@/_types/type"
import { getFileInfo } from "@/actions/getFileInfo"
import { Button } from "@/components/ui/button"

export default function FilePresent({ filePath, fileIdx, fileList, onClick }: { filePath: string, fileIdx: number, fileList: string[], onClick: (idx: number | null) => void }) {
    const [fileData, setFileData] = useState<FileData>()
    const [idx, setIdx] = useState<number | null>(fileIdx)

    const { userPrefs, updateUserPrefs } = useUserPrefs("settings");
    const [loop, setLoop] = useState<boolean>(userPrefs.mediaLoop);
    const [autoplay, setAutoplay] = useState<boolean>(userPrefs.mediaAutoplay);
    const [hideControls, setHideControls] = useState<boolean>(false);

    function close() {
        document.body.classList.remove("overflow-x-hidden")
        document.body.classList.remove("overflow-y-hidden")
        setIdx(null);
        onClick(null);
    }

    function changeMedia(side: number) {
        if ((side == -1 || !side) && idx != null && idx > 0) {
            setIdx(prev => {
                if (prev as number <= 0) {
                    return prev
                }
                return prev as number - 1;
            })
        } else {
            if (idx != null && idx < fileList.length - 1) {
                setIdx(prev => {
                    if (prev as number >= fileList.length - 1) {
                        return prev
                    }
                    return prev as number + 1;
                })
            }
        }
        document.getElementById(`File-Show-${idx}`)?.scrollIntoView();
    }

    const dynaMedia = (): ReactNode => {
        if (!fileData || fileData === undefined || idx == null) return;
        console.log(fileData);
        const sizing = getMediaSizing(fileData.width, fileData.height);
        return (
            !(fileList[idx as number].endsWith("mp4") || fileList[idx as number].endsWith("mkv")) ?
                <div className="w-full h-full flex items-center z-0">
                    <Image
                        alt={`${fileData.filePath}`}
                        src={`/api/getFileStream?filePath=${encodeURIComponent(fileList[idx as number])}`}
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
                :
                <div className="w-auto h-full">
                    <video autoPlay={autoplay} loop={loop} className="w-auto h-full mx-auto" controls src={`/api/getFileStream?filePath=${encodeURIComponent(fileList[idx as number])}`} />
                </div>
        )
    }

    function keyDownHandler(e: KeyboardEvent) {
        if (e.code == 'Escape' || e.code == 'ControlRight') {
            close();
        } else if (e.code == 'ArrowRight') {
            if (idx != null) {
                changeMedia(1)
            }
        } else if (e.code == 'ArrowLeft') {
            if (idx != null) {
                changeMedia(-1)
            }
        } else if (e.code == 'KeyL') {
            setLoop(prev => !prev);
        } else if (e.code == 'KeyO' || e.code == 'KeyR') {
            setAutoplay(prev => !prev);
        } else if (e.code == 'KeyH') {
            setHideControls(prev => !prev);
        }
        console.log(e.code)
    }

    useEffect(() => {
        document.body.classList.add("overflow-x-hidden")
        document.body.classList.add("overflow-y-hidden")
        document.addEventListener("keydown", keyDownHandler);

        async function fun() {
            let res = await getFileInfo(filePath);
            setFileData(res);
        }
        fun();

        // clean up
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [])

    useEffect(() => {
        updateUserPrefs({ mediaLoop: loop, mediaAutoplay: autoplay })
    }, [loop, autoplay])

    useEffect(() => {
        async function fun() {
            let res = await getFileInfo(filePath);
            setFileData(res);
        }
        fun();
    }, [idx])

    if (idx == null) {
        return <></>
    } else {
        return (
            <div className="fixed w-[100vw] h-[100vh] bg-black/50 z-50 top-0 left-0 right-0 backdrop-blur-sm bottom-0">
                {!hideControls &&
                    <div className="absolute w-full h-15 flex flex-row-reverse items-center gap-4 px-4 z-50!">
                        <>
                            <Button className="hover:bg-secondary" variant={"secondary"} onClick={() => close()}><FaX /></Button>
                            <Button variant={"secondary"} className="" onClick={() => setLoop(!loop)}>
                                <MdOutlineLoop className={`w-full h-auto ${loop ? "text-site-accent" : ""}`} />
                            </Button>
                            <Button variant={"secondary"} className="" onClick={() => setAutoplay(!autoplay)}>
                                <FaPlay className={`w-full h-auto ${autoplay ? "text-site-accent" : ""}`} />
                            </Button>
                        </>
                    </div>
                }
                <div className="w-full h-full p-10 py-0">
                    <button onClick={() => changeMedia(-1)} className="fixed top-1/2 left-0 pl-2 w-10 aspect-square"><IoIosArrowDropleft className="w-full h-full hover:text-site-accent" /></button>
                    {fileData &&
                        dynaMedia()
                    }
                    <button onClick={() => changeMedia(1)} className="fixed top-1/2 right-0 pr-2 w-10 aspect-square"><IoIosArrowDropright className="w-full h-full hover:text-site-accent" /></button>
                </div>
            </div>
        )
    }
}

