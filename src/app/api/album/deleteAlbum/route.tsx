import { db } from '@/db';
import { album } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json();

        const id = body.albumID;
        if (!id) throw Error("No album ID given");

        const res = await db.delete(album).where(eq(album.id, id.toString()));
        return NextResponse.json({result: res}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request:`);
        console.error(err)
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
