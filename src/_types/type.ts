import { Signal } from "@preact/signals-react"

type MediaJsonRes = {
    mediaRoot: string
    mediaDir: string
    mediaFile: string
    mediaPath: string
    mediaType: string
    stats: string
}

export type UserPrefs = {
  sortType: string,
  mediaRoots: string[]
}

export type MediaTypes = {
    photos: Signal<boolean>
    videos: Signal<boolean>
}


export type Filter = {
    media: MediaTypes,
    sorting: Signal<"ascending" | "descending">
}

export type FilterPrimative = {
    media: {
        photos: boolean,
        videos: boolean
    },
    sorting: "ascending" | "descending"
}
