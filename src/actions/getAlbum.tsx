'use server'

export const getAlbum = async (id: string, withThumbnail?: boolean) => {
    try {
        const response = await fetch(`http://localhost:3000/api/album/getAlbum?id=${id}${withThumbnail ? "&withThumbnail=true": ""}`)
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
