import { Filter, MediaTypes } from '@/_types/type'
import { Media, MediaAlbums } from '@/db/types'
import { Signal, signal } from '@preact/signals-react'

export let refreshMediaList: Signal<number> = signal(0)
export let mediaList: Signal<MediaAlbums[]> = signal([])
export let mediaSelectList: Signal<MediaAlbums[]> = signal([])
export let mediaNotFinished: Signal<boolean> = signal(true)
export let mediaOffset: Signal<number> = signal(0)
export let mediaPresentIdx: Signal<number | null> = signal(null)

export const filterSignal: Filter = {
    media: {
        photos: signal(true),
        videos: signal(true)
    },
    sorting: signal("ascending"),
    sortBy: signal("created"),
    search: signal(""),
    size: signal(""),
    albums: signal([])
}
