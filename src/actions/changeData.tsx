'use server'

export const changeData = async (fd: FormData) => {
    try {
        const response = await fetch(`http://localhost:3000/api/changeData`, {
            method: 'POST',
            body: fd
        })
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
