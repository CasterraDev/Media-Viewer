import { Filter, FilterPrimative, MediaSizing } from "@/_types/type";

export function getMediaSizing(width: number, height: number): MediaSizing {
    if (width == height) {
        return MediaSizing.square;
    } else if (width > height) {
        return MediaSizing.landscape
    } else if (width < height) {
        return MediaSizing.portrait
    }
    return MediaSizing.square
}

export function secsIntoData(totalSeconds: number): { hours: number, minutes: number, seconds: number } {
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return { hours, minutes, seconds }
}

export function secsIntoHexidecmal(totalSeconds: number): string {
    let data = secsIntoData(totalSeconds);
    let str = ``;
    if (data.hours != 0){
        str.concat(`${data.hours.toString().padStart(2, "0")}:`)
    }
    return `${str}${data.minutes.toString().padStart(2, "0")}:${data.seconds.toString().padStart(2, "0")}`
}

export function filterTypeToPrimative(filter: Filter): FilterPrimative {
    let f: FilterPrimative = {
        media: {
            photos: filter.media.photos.value,
            videos: filter.media.videos.value,
        },
        sorting: filter.sorting.value,
        sortBy: filter.sortBy.value,
        search: filter.search.value,
        size: filter.size.value,
        albums: filter.albums.value
    }
    return f;
}
