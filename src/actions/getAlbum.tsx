'use server'

export const getAlbum = async (id: string, withThumbnail?: boolean, withMedias?: boolean) => {
    try {
        const response = await fetch(`http://localhost:3000/api/getAlbum?id=${id}${withThumbnail ? "&withThumbnail=true" : ""}${withMedias ? "&withMedias=true" : ""}`)
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
