import { Signal } from "@preact/signals-react"

export type MediaJsonRes = {
    mediaRoot: string
    mediaDir: string
    mediaFile: string
    mediaPath: string
    mediaType: string
    stats: string
}

export enum MediaSizing {
    'square',
    'landscape',
    'portrait'
}

export enum MediaType {
    'photos',
    'videos'
}

export type UserPrefs = {
  sortType: string,
  mediaRoots: string[],
  mediaLoop: boolean,
  mediaAutoplay: boolean
}

export type MediaTypes = {
    photos: Signal<boolean>
    videos: Signal<boolean>
}

export type Filter = {
    media: MediaTypes,
    sorting: Signal<"ascending" | "descending">
    sortBy: Signal<"created" | "size">
    search: Signal<string>
}

export type FilterPrimative = {
    media: {
        photos: boolean,
        videos: boolean
    },
    sorting: "ascending" | "descending"
    sortBy: "created" | "size"
    search: string
}
