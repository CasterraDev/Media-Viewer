import { db } from '@/db';
import { album, media, mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { inArray } from 'drizzle-orm';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        let res;

        if (!(!body.mediaIDs || body.mediaIDs.length == 0)) {
            const mar: any[] = body.mediaIDs.map((x: string) => ({
                mediaID: x,
                albumID: body.albumID
            }))

            res = await db.insert(mediasToAlbums).values(mar)
        } else {
            throw new Error("No media IDs given")
        }

        return NextResponse.json({ res }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
