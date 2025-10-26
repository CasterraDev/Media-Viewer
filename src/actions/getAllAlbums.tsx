'use server'

export const getAllAlbums = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/getAllAlbums`)
        const data = (await response.json())
        return data.albums
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
