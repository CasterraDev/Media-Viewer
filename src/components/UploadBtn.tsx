"use client"

import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function UploadBtn({ roots }: { roots: string[] }) {
    const [uploading, setUploading] = useState<boolean>(false)

    const click = async (_event: any, rootsList: string[] = roots) => {
        setUploading(true);
        const body = {
            mediaRoots: rootsList
        }

        await fetch("/api/uploadFilesToDb", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).finally(() => {
            setUploading(false);
        })
    }

    return (
        <div className="w-full h-full flex flex-row border-2 border-[var(--color-foreground)] rounded-lg">
            <Button disabled={uploading} onClick={(e) => click(e)}
                className="rounded-br-none rounded-tr-none">
                Upload
            </Button>
            <div className="h-auto w-0.5 py-1 bg-accent" />
            <DropdownMenu>
                <DropdownMenuTrigger disabled={uploading} className="bg-primary text-primary-foreground rounded-br-md rounded-tr-md hover:bg-primary/90"><IoIosArrowDown /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel className="capitalize font-bold">Roots</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roots.map((r, i) => (
                        <DropdownMenuItem key={i} disabled={uploading} className="cursor-pointer" onClick={(e) => click(e, [r])}>{r}</DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
