"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { FaCheck, FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { filterSignal, mediaNotFinished, mediaList, mediaOffset } from "@/utils/signals";
import { useSignals } from "@preact/signals-react/runtime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, Separator } from "@radix-ui/react-dropdown-menu";
import { FormEvent, useEffect } from "react";
import { Filter, FilterSortByArray, FilterSortingArray } from "@/_types/type";
import useUserPrefs from "@/hooks/useUserPrefs";
import { convertSignalToPrimative } from "@/utils/clientUtil";
import { batch, Signal } from "@preact/signals-react";

function emptyMedia() {
    mediaNotFinished.value = true
    mediaOffset.value = 0;
    mediaList.value = []
}

function reset() {
    filterSignal.media.photos.value = true
    filterSignal.media.videos.value = true

    filterSignal.sorting.value = "ascending"
    filterSignal.sortBy.value = "created"
    filterSignal.search.value = ""
    emptyMedia()
}

function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    emptyMedia();
}

export default function Search() {
    useSignals();
    const { userPrefs, updateUserPrefs } = useUserPrefs("settings");

    function save() {
        updateUserPrefs({ savedFilter: convertSignalToPrimative(filterSignal) })
    }

    useEffect(() => {
        console.log(filterSignal)
        let fi = userPrefs.savedFilter;
        // Fill filterSignal with the savedFilter that is a primative
        function fill(obj: { [key: string]: any }, prefix?: string) {
            for (var key of Object.keys(obj)) {
                let val = (obj as any)[key];
                let o = prefix ? (filterSignal as any)[prefix][key] : (filterSignal as any)[key]

                if (typeof val === 'object' && !Array.isArray(val) && val !== null) {
                    o = fill(val, key)
                    continue
                }
                o.value = val
            }
        }

        batch(() => fill(fi));
    }, [])

    return (
        <form className="flex flex-row gap-1 w-full" onSubmit={submit}>
            <Dialog>
                <DialogTrigger><FaFilter /></DialogTrigger>
                <DialogContent aria-describedby="Filter">
                    <DialogHeader>
                        <DialogTitle>Filter Options</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-row w-full justify-evenly">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="capitalize">Sorting: {filterSignal.sorting.value}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterSignal.sorting.value} onValueChange={(e) => { filterSignal.sorting.value = e as any; emptyMedia() }}
                                    className="border-1 border-[var(--color-foreground)] w-fit mx-auto bg-[var(--color-background)]">
                                    {FilterSortingArray.map((x) => (
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
                                <Button variant="outline" className="capitalize">Sort By: {filterSignal.sortBy.value}</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit">
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterSignal.sortBy.value} onValueChange={(e) => { filterSignal.sortBy.value = e as any; emptyMedia() }}
                                    className="border-1 border-[var(--color-foreground)] w-fit mx-auto bg-[var(--color-background)]">
                                    {FilterSortByArray.map((x) => (
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
                    <Button onClick={() => { filterSignal.media.photos.value = !filterSignal.media.photos.value; emptyMedia() }}
                        className={`flex flex-row gap-1 ${filterSignal.media.photos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filterSignal.media.photos.value ? <FaCheck /> : <FaX />}
                        Photos
                    </Button>
                    <Button onClick={() => { filterSignal.media.videos.value = !filterSignal.media.videos.value; emptyMedia() }}
                        className={`flex flex-row gap-1 ${filterSignal.media.videos.value ? "bg-[var(--color-foreground)] text-[var(--color-background)]" : "bg-[var(--color-background)] not-hover:text-[var(--color-foreground)]"}`}>
                        {filterSignal.media.videos.value ? <FaCheck /> : <FaX />}
                        Videos
                    </Button>
                    <Separator />
                    <div className="flex flex-row gap-3">
                        <Button variant="secondary" onClick={save}>Save As Pref</Button>
                        <div className="grow" />
                        <Button variant="secondary" type="reset" onClick={reset}>Reset</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Input type="search" name="search" placeholder="Search" autoComplete="off" onChange={(e) => filterSignal.search.value = e.target.value} />
            <Button type="submit" variant="outline"><FaMagnifyingGlass className="bg-[var(--color-background)] text-[var(--color-foreground)]" /></Button>
        </form>
    )
}


