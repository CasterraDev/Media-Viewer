"use client"
import { FileData, MediaSizing } from "@/_types/type";
import Image from "next/image";
import { ReactNode } from "react"
import { FaPlay } from "react-icons/fa6";

type MediaShowType = {
    filePath: string
    fileData: FileData
    idx: number
    dimensionType: MediaSizing
    sizeScale?: number
    onClick?: (idx: number) => void
}

export default function FileShow(props: MediaShowType) {
    const dynaMedia = (): ReactNode => {
        console.log(props.fileData)
        if (props.fileData.type.includes("photos")) {
            return (
                <button className="relative w-full h-fit" onClick={() => {if (props.onClick) props.onClick(props.idx)}}>
                    <Image
                        alt={`${props.fileData.filePath}`}
                        src={`/api/getFileStream?filePath=${props.fileData.filePath}`}
                        sizes={props.sizeScale ? `calc(100vw * ${props.sizeScale})` : "100vw"}
                        style={{
                            width: '100%',
                            height: 'auto',
                        }}
                        width={500}
                        height={300}
                    />
                </button>
            )
        } else {
            return (
                <button
                    className="relative w-full h-fit" onClick={() => {if (props.onClick) props.onClick(props.idx)}}>
                    <video preload="metadata" playsInline={true}>
                        <source src={`/api/getFileStream?filePath=${props.fileData.filePath}`} />
                    </video>
                    <div className="absolute top-0 right-0 z-10 m-1 flex flex-row gap-1">
                        <FaPlay className="m-auto" />
                    </div>
                </button>
            )
        }
    }

    return (
        <>
            <div id={`File-Show-${props.idx}`} className={`MediaShow ${MediaSizing[props.dimensionType]} w-full h-full`}>
                {
                    dynaMedia()
                }
            </div>
        </>
    )
}

