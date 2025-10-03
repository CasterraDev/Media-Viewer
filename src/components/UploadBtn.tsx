"use client"

import useUserPrefs from "@/hooks/useUserPrefs";
import { MouseEventHandler, useEffect, useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserPrefs } from "@/_types/type";

export default function UploadBtn() {
    const [uploading, setUploading] = useState<boolean>(false)
    const { userPrefs, updateUserPrefs: _ } = useUserPrefs("settings");
    const [settings, setSettings] = useState<UserPrefs>(userPrefs)

    const click = async (_event: any, roots: string[] = userPrefs.mediaRoots) => {
        setUploading(true);
        console.log("Uploading dir")
        const body = {
            mediaRoots: roots
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

    useEffect(() => {
        setSettings(userPrefs)
    }, [userPrefs])

    return (
        <div className="w-full h-full flex flex-row border-[1.5px] border-[var(--color-foreground)] rounded-lg">
            <button disabled={uploading} onClick={(e) => click(e)} className=" rounded-bl-lg rounded-tl-lg cursor-pointer border-white p-2 hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]">Upload</button>
            <div className="h-auto w-0.5 py-1 bg-[var(--color-foreground)]" />
            <DropdownMenu>
                <DropdownMenuTrigger disabled={uploading} className="hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)] rounded-br-lg rounded-tr-lg"><IoIosArrowDown /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="capitalize font-bold">Roots</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {settings.mediaRoots.map((r, i) => (
                        <DropdownMenuItem key={i} className="cursor-pointer" onClick={(e) => click(e, [r])}>{r}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
