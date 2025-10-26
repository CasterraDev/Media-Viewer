"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FormEvent, Suspense, useEffect, useState } from "react"
import FilePresent from "./FilePresent"
import FileShow from "./FileShow"
import { FileData, MediaSizing } from "@/_types/type"
import { getFileInfo } from "@/actions/getFileInfo"

export default function FileLoader() {
    const [filePaths, setFilesPaths] = useState<string[]>([])
    const [filePathClick, setFilesPathClick] = useState<number | null>(null)

    const [fileData, setFileData] = useState<FileData[]>([])
    useEffect(() => {
        async function fun() {
            let arr = []
            for (let x in filePaths) {
                let res = await getFileInfo(filePaths[x]);
                arr.push(res);
            }
            setFileData(arr);
        }
        fun();
    }, [filePaths])

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const text = fd.get("file-textarea");
        const files = text?.toString().split(/[\n]/)
        if (files) {
            setFilesPaths(files);
        }
    }

    function fileClick(idx: number | null) {
        if (idx == null) {
            document.body.classList.remove("overflow-x-hidden")
            document.body.classList.remove("overflow-y-hidden")
            setFilesPathClick(null);
        } else {
            setFilesPathClick(idx);
        }
    }

    return (
        <div className="mx-auto">
            <form className="flex flex-col gap-3 w-3/5 mx-auto" onSubmit={submit}>
                <label htmlFor="file-textarea">Files</label>
                <Textarea id="file-textarea" name="file-textarea" placeholder="Place files here. Seperated by New-line" />
                <Button className="ml-auto" type="submit">Load Files</Button>
            </form>
            <div className="m-5">
                <div className={`grid w-full h-full`}
                    style={{ "gridTemplateColumns": `repeat(4, minmax(0, 1fr))` }}>
                    {fileData.map((_m, i) => (
                        <Suspense key={`Media-Loader-${i}`}>
                            <FileShow filePath={filePaths[i]} fileData={fileData[i]} idx={i} dimensionType={MediaSizing.portrait} onClick={fileClick} />
                        </Suspense>
                    ))}
                </div>
                {filePathClick != null &&
                    <Suspense>
                        <FilePresent filePath={filePaths[filePathClick]} fileIdx={filePathClick} fileList={filePaths} onClick={fileClick} />
                    </Suspense>
                }
            </div>
        </div>
    )
}

