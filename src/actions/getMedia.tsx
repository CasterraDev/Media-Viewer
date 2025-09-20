'use server'

export const getMedias = async (offset: number, limit: number) => {
  try {
    const response = await fetch(`http://localhost:3000/api/getMediaScroller?offset=${offset}&limit=${limit}`)
    const data = (await response.json())
    return data.medias
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}
