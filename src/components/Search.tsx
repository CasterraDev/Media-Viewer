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

function emptyMedia() {
    mediaList.value = []
    mediaNotFinished.value = true
    mediaOffset.value = 0;
}

function reset() {
    filter.media.photos.value = true
    filter.media.videos.value = true

    filter.sorting.value = "ascending"
    emptyMedia()
}

export default function Search() {
    useSignals();
    return (
        <form className="flex flex-row gap-1 w-full">
            <Dialog>
                <DialogTrigger>Filter</DialogTrigger>
                <DialogContent aria-describedby="Filter">
                    <DialogHeader>
                        <DialogTitle>Filter Options</DialogTitle>
                    </DialogHeader>
                    <DialogTitle>Media</DialogTitle>
                    <Button onClick={() => {filter.media.photos.value = !filter.media.photos.value; emptyMedia()}}
                        className={`flex flex-row gap-1 ${filter.media.photos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filter.media.photos.value ? <FaCheck /> : <FaX />}
                        Photos
                    </Button>
                    <Button onClick={() => {filter.media.videos.value = !filter.media.videos.value; emptyMedia()} } 
                        className={`flex flex-row gap-1 ${filter.media.videos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filter.media.videos.value ? <FaCheck /> : <FaX />}
                        Videos
                    </Button>
                    <DialogTitle>Sorting</DialogTitle>
                    <div className="flex flex-col">
                        {["ascending", "descending"].map((x) => (
                            <div className="flex flex-row gap-1" key={x}>
                                <input type="radio" name="sorting" id={x} value={x} 
                                    onChange={(e) => {filter.sorting.value = e.target.value as any; emptyMedia()}}
                                    defaultChecked={filter.sorting.value == x} />
                                <label htmlFor={x} className="capitalize">{x}</label>
                            </div>
                        ))}
                    </div>
                    <Button type="reset" onClick={reset}>Reset</Button>
                </DialogContent>
            </Dialog>
            <Input type="search" />
            <Button type="submit" variant="outline"><FaMagnifyingGlass className="bg-[var(--color-background)] text-[var(--color-foreground)]" /></Button>
        </form>
    )
}


