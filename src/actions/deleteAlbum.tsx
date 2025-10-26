'use server'

export const deleteAlbum = async (albumID: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/album/deleteAlbum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ albumID })
        })
        const data = await response.json()
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
