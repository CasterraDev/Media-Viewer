import { db } from '@/db';
import { album, media, mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.formData();

        const id = body.get("albumID")?.toString();
        if (!id) throw Error("No album ID given");

        const title = body.get("title")?.toString();
        const description = body.get("description")?.toString();
        console.log("Title: " + title);
        console.log("Desc: " + description);
        
        const res = await db.update(album).set({title: title, description: description}).where(eq(album.id, id));
        return NextResponse.json({result: res}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        console.dir(err);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
