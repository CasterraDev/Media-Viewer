"use client"

import { getAllAlbums } from "@/actions/getAllAlbums";
import AlbumThumb from "@/app/albums/AlbumThumb";
import { Album, Media } from "@/db/types";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { LuAlbum } from "react-icons/lu";
import { cn } from "@/lib/utils";

export default function AlbumCommand({ shouldDisable, onAlbumSelect, onlyTitle, listClassname, contentClassname, ...props }:
    { shouldDisable?: boolean, onAlbumSelect?: (album: Album & { thumbnail: Media }) => void, onlyTitle?: boolean, listClassname?: string, contentClassname?: string } & React.ComponentProps<"div">) {
    const [albums, setAlbums] = useState<(Album & { thumbnail: Media })[]>([]);
    const [albumComboboxOpen, setAlbumComboboxOpen] = useState<boolean>(false);

    useEffect(() => {
        async function fun() {
            setAlbums(await getAllAlbums())
        }
        fun();
    }, [])

    return (
        <>
            {albums &&
                <Popover open={albumComboboxOpen} onOpenChange={setAlbumComboboxOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={albumComboboxOpen}
                            className="justify-between"
                            disabled={shouldDisable}
                        >
                            <LuAlbum />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className={cn(contentClassname)}>
                        <Command>
                            <CommandInput placeholder="Search Albums..." className="h-9" />
                            <CommandList>
                                <CommandEmpty>No Albums found.</CommandEmpty>
                                <CommandGroup>
                                    <div className={cn(listClassname)}>
                                        {albums.map((album) => (
                                            <CommandItem
                                                key={album.title + album.id}
                                                value={album.title + album.id}
                                                className="cursor-pointer"
                                                disabled={shouldDisable}
                                                onSelect={() => { if (onAlbumSelect) { onAlbumSelect(album); setAlbumComboboxOpen(false) } }}
                                            >
                                                {onlyTitle ?
                                                    <p>{album.title}</p>
                                                    :
                                                    <AlbumThumb curAlbum={album} />
                                                }
                                            </CommandItem>
                                        ))}
                                    </div>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            }
        </>
    )
}

