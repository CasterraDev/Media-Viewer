'use server'

import { db } from "@/db"
import { media } from "@/db/schema"
import { MediaAlbums, MediaInsert } from "@/db/types"
import { eq } from "drizzle-orm"

export const changeMediaData = async (mediaID: string, title?: string, description?: string) => {
    try {
        let u: Partial<MediaInsert> = {}
        if (title) {
            u.title = title
        }
        if (description) {
            u.description = description
        }
        let res = await db.update(media).set(u).where(eq(media.id, mediaID)).returning({ id: media.id });
        let m = await db.query.media.findFirst({
            where: eq(media.id, mediaID),
            with: {
                albums: {
                    with: {
                        album: true
                    }
                }
            },
        })
        return m as MediaAlbums;
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}
