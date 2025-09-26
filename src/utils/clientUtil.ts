import { Filter, FilterPrimative } from "@/_types/type";

export function filterTypeToPrimative(filter: Filter): FilterPrimative {
    let f: FilterPrimative = {
        media: {
            photos: filter.media.photos.value,
            videos: filter.media.videos.value,
        },
        sorting: filter.sorting.value
    }
    return f;
}
