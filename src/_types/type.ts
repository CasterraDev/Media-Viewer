import { Signal } from "@preact/signals-react"

export type FileData = {
    filePath: string,
    stats: string,
    mimeType: string,
    type: string,
    width: number,
    height: number
}

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

export type FilterSorting = "ascending" | "descending" | "random"
export type FilterSortBy = "created" | "size"

export enum FilterSortingEnum {
    "ascending", "descending", "random"
}

export enum FilterSortByEnum {
    "created", "size"
}

export type Filter = {
    media: MediaTypes,
    sorting: Signal<FilterSorting>
    sortBy: Signal<FilterSortBy>
    search: Signal<string>
    size: Signal<string>
}

export type FilterPrimative = {
    media: {
        photos: boolean,
        videos: boolean
    },
    sorting: FilterSorting
    sortBy: FilterSortBy
    search: string
    size: string
}
