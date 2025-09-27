'use server'

import { FilterPrimative } from "@/_types/type"

export const getMedias = async (offset: number, limit: number, filter?: FilterPrimative) => {
    try {
        let params = `offset=${offset}&limit=${limit}`
        if (filter) {
            // TODO: This is bad
            if (filter.sorting) {
                params = params.concat(`&sorting=${filter.sorting}`)
            }
            if (filter.sortBy) {
                params = params.concat(`&sortBy=${filter.sortBy}`)
            }
            if (filter.media.photos) {
                params = params.concat(`&mediaTypes=photos`)
            }
            if (filter.media.videos) {
                params = params.concat(`&mediaTypes=videos`)
            }
        }
        console.log(params)
        console.log(filter)
        const response = await fetch(`http://localhost:3000/api/getMediaScroller?${params}`)
        const data = (await response.json())
        return data.medias
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
