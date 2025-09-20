"use client"

import { useState } from "react"

export default function UploadBtn(props: {}) {
    const [uploading, setUploading] = useState<boolean>(false)

    const click = async () => {
        setUploading(true);
        console.log("Uploading dir")
        const body = {
            mediaRoot: "/home/cas/Image-Tutorial/"
        }

        const res = await fetch("/api/uploadFilesToDb", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        setUploading(false);
    }

    return (
        <div className="w-full h-full">
            <button disabled={uploading} onClick={click} className="w-full h-full cursor-pointer border-white">Upload</button>
        </div>
    )
}
