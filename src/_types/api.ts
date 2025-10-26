export type CreateAlbumAPIPOST = {
    title: string
    description: string
    thumbnailID?: string
    mediaIDs?: string[]
}

export type ChangeAlbumAPIPOST = {
    albumID: string
    title: string
    description: string
    thumbnailID?: string
}
