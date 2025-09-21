'use server'

export const getSettingsMediaRoots = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/getSettingsMediaRoots`)
    const data = (await response.json())
    return data.mediaRoots
  } catch (error: unknown) {
    console.log(error)
    throw new Error(`An error happened: ${error}`)
  }
}
