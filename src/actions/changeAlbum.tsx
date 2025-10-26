'use server'

import { ChangeAlbumAPIPOST } from "@/_types/api"

export const changeAlbum = async ( a: Partial<ChangeAlbumAPIPOST>) => {
    try {
        const response = await fetch(`http://localhost:3000/api/changeAlbum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(a)
        })
        const data = await response.json()
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
