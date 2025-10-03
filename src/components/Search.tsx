"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { FaCheck, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { filter, mediaNotFinished, mediaList, mediaOffset } from "@/utils/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import { FormEvent } from "react";

function emptyMedia() {
    mediaNotFinished.value = true
    mediaOffset.value = 0;
    mediaList.value = []
}

function reset() {
    filter.media.photos.value = true
    filter.media.videos.value = true

    filter.sorting.value = "ascending"
    filter.sortBy.value = "created"
    filter.search.value = ""
    emptyMedia()
}

function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    emptyMedia();
}

export default function Search() {
    useSignals();
    return (
        <form className="flex flex-row gap-1 w-full" onSubmit={submit}>
            <Dialog>
                <DialogTrigger>Filter</DialogTrigger>
                <DialogContent aria-describedby="Filter">
                    <DialogHeader>
                        <DialogTitle>Filter Options</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-row w-full justify-evenly">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="capitalize">Sorting: {filter.sorting.value}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filter.sorting.value} onValueChange={(e) => {filter.sorting.value = e as any; emptyMedia()}}
                                    className="border-1 border-[var(--color-foreground)] w-fit mx-auto bg-[var(--color-background)]">
                                    {["ascending", "descending", "random"].map((x) => (
                                        <DropdownMenuRadioItem key={x} value={x}
                                            className="capitalize cursor-pointer text-center px-4 first-of-type:pt-2 last-of-type:pb-2
                                            hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]">
                                            {x}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="capitalize">Sort By: {filter.sortBy.value}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filter.sortBy.value} onValueChange={(e) => {filter.sortBy.value = e as any; emptyMedia()}}
                                    className="border-1 border-[var(--color-foreground)] w-fit mx-auto bg-[var(--color-background)]">
                                    {["created", "size"].map((x) => (
                                        <DropdownMenuRadioItem key={x} value={x}
                                            className="capitalize cursor-pointer text-center px-4 first-of-type:pt-2 last-of-type:pb-2
                                            hover:bg-[var(--color-foreground)] hover:text-[var(--color-background)]">
                                            {x}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <DialogTitle>Media</DialogTitle>
                    <Button onClick={() => { filter.media.photos.value = !filter.media.photos.value; emptyMedia() }}
                        className={`flex flex-row gap-1 ${filter.media.photos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filter.media.photos.value ? <FaCheck /> : <FaX />}
                        Photos
                    </Button>
                    <Button onClick={() => { filter.media.videos.value = !filter.media.videos.value; emptyMedia() }}
                        className={`flex flex-row gap-1 ${filter.media.videos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filter.media.videos.value ? <FaCheck /> : <FaX />}
                        Videos
                    </Button>
                    <Separator />
                    <Button variant="secondary" type="reset" onClick={reset}>Reset</Button>
                </DialogContent>
            </Dialog>
            <Input type="search" name="search" placeholder="Search" autoComplete="off" onChange={(e) => filter.search.value = e.target.value}/>
            <Button type="submit" variant="outline"><FaMagnifyingGlass className="bg-[var(--color-background)] text-[var(--color-foreground)]" /></Button>
        </form>
    )
}


