"use client"

import useUserPrefs from "@/hooks/useUserPrefs";
import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io";

export default function UploadBtn() {
    const [uploading, setUploading] = useState<boolean>(false)
    const { userPrefs, updateUserPrefs: _ } = useUserPrefs("settings");

    const click = async () => {
        setUploading(true);
        console.log("Uploading dir")
        const body = {
            mediaRoots: userPrefs.mediaRoots
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
        <div className="w-full h-full flex flex-row border-[1.5px] border-[var(--color-foreground)] rounded-lg">
            <button disabled={uploading} onClick={click} className="rounded-lg cursor-pointer border-white p-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]">Upload</button>
            <div className="h-auto w-0.5 py-1 bg-[var(--color-foreground)] rounded-2xl" />
            <button disabled={uploading} className="rounded-lg cursor-pointer border-white p-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]"><IoIosArrowDown /></button>
        </div>
    )
}
