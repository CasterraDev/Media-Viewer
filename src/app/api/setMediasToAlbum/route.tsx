import { db } from '@/db';
import { mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        let res;

        if (!body.albumID) {
            throw new Error("No album ID given")
        }

        if (!body.mediaIDs || body.mediaIDs.length == 0) {
            throw new Error("No media IDs given")
        }

        const mar = body.mediaIDs.map((x: string) => ({
            mediaID: x,
            albumID: body.albumID
        }))

        res = await db.insert(mediasToAlbums).values(mar)

        return NextResponse.json({ res }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request:`);
        console.error(err);
        return new Response(`Internal server error: ${JSON.stringify(err)}`, { status: 500 });
    }
}
