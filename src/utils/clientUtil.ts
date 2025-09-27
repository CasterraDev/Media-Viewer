import { Filter, FilterPrimative, MediaSizing } from "@/_types/type";

export function getMediaSizing(width: number, height: number): MediaSizing {
    if (width == height){
        return MediaSizing.square;
    }else if (width > height){
        return MediaSizing.landscape
    }else if (width < height){
        return MediaSizing.portrait
    }
    return MediaSizing.square
}

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
