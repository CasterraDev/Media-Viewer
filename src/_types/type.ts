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
    mediaAutoplay: boolean,
    savedFilter: FilterPrimative
}

export type MediaTypes = {
    photos: Signal<boolean>
    videos: Signal<boolean>
}

export const FilterSortingArray = ["ascending", "descending", "random"] as const;
type FilterSorting = typeof FilterSortingArray[number];
export const FilterSortByArray = ["created", "modified", "size"] as const;
type FilterSortBy = typeof FilterSortByArray[number];

export type Filter = {
    media: MediaTypes,
    sorting: Signal<FilterSorting>
    sortBy: Signal<FilterSortBy>
    search: Signal<string>
    size: Signal<string>
    albums: Signal<string[]>
}

export type SignalToPrimative<ObjectType extends object> =
    { [Key in keyof ObjectType]: ObjectType[Key] extends Signal
        ? ObjectType[Key]['value']
        : ObjectType[Key] extends Object
        ? SignalToPrimative<ObjectType[Key]>
        : Key
    };

export type FilterPrimative = SignalToPrimative<Filter>
