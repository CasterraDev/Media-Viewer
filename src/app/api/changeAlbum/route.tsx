import { db } from '@/db';
import { album, media, mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm';
import { Album } from '@/db/types';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json();

        const id = body.albumID;
        if (!id) throw Error("No album ID given");

        const title = body.title;
        const description = body.description;
        const thumbnailID = body.thumbnailID;

        let s: Partial<Album> = {}
        if (title){
            s.title = title.toString();
        }
        if (description){
            s.description = description.toString();
        }
        if (thumbnailID){
            s.thumbnailID = thumbnailID.toString();
        }

        const res = await db.update(album).set(s).where(eq(album.id, id.toString()));
        return NextResponse.json({result: res}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
