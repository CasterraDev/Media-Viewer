'use server'

export const getFileInfo = async (filePath: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/getFileInfo?filePath=${encodeURI(filePath)}`)
        const data = (await response.json())
        return data
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
