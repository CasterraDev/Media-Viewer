"use client"

import { FormEvent, useState } from "react"
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
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { XIcon } from "lucide-react";

export default function UploadBtn({ roots, advanced }: { roots: string[], advanced?: boolean }) {
    const [uploading, setUploading] = useState<boolean>(false)
    const [uploadRoots, setUploadRoots] = useState<string[]>([])

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

    function remove(i: number) {
        let u = uploadRoots.indexOf(roots[i])
        console.log(u)
        if (u != -1) {
            // Slice to make the array a different object so react will cause a re-render
            let r = uploadRoots.slice(0);
            console.log(r)
            r.splice(u, 1);
            console.log(r)
            setUploadRoots(r);
        }
    }

    function add(i: number) {
        let r = roots;
        if (!uploadRoots.includes(r[i])) {
            setUploadRoots(prev => [...prev, r[i]])
        }
    }

    return (
        <div className="w-full h-full flex flex-row gap-5">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"ghost"}>Advanced</Button>
                </DialogTrigger>
                <DialogContent className="max-h-full overflow-auto">
                    <DialogTitle>Upload some roots</DialogTitle>
                    {roots.map((r: string, i: number) => (
                        <div className="flex flex-row gap-3" key={i}>
                            <Input placeholder={r} defaultValue={r} name={`root-${i}`} disabled />
                            {uploadRoots.includes(r) ?
                                <Button type="button" className="cursor-pointer" onClick={() => remove(i)}><XIcon /></Button>
                                :
                                <Button type="button" className="cursor-pointer" onClick={() => add(i)}>Save</Button>
                            }
                        </div>
                    ))}
                    <Button disabled={uploading} onClick={(e) => click(e, uploadRoots)}>
                        Upload
                    </Button>
                </DialogContent>
            </Dialog>
            <div className="border-2 border-foreground rounded-lg flex flex-row">
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
        </div>
    )
}
