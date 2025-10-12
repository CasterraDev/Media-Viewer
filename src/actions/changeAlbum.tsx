'use server'

export const changeAlbum = async ( form: FormData ) => {
    try {
        const response = await fetch(`http://localhost:3000/api/changeAlbum`, {
            method: 'POST',
            body: form
        })
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
