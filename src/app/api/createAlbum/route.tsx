import { db } from '@/db';
import { album, media, mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';
import { CreateAlbumAPIPOST } from '@/_types/api';

export async function POST(
    req: NextRequest,
) {
    try {
        const body: CreateAlbumAPIPOST = await req.json()

        await db.transaction(async (tx) => {
            const al = await db.insert(album).values({
                title: body.title || null,
                description: body.description || null
            }).returning({ id: album.id }).onConflictDoNothing()

            if (!(!body.mediaIDs || body.mediaIDs.length == 0)) {
                const me = await db.select({ id: media.id }).from(media).where(
                    inArray(media.id, body.mediaIDs),
                );

                const mar: any[] = me.map((x) => ({
                    mediaID: x,
                    albumID: al[0].id
                }))

                const res = await db.insert(mediasToAlbums).values(mar)
            }
        })
        return NextResponse.json({}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
