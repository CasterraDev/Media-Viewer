import { db } from '@/db';
import { album } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
    req: NextRequest,
) {
    try {
        const albumID = req.nextUrl.searchParams.get("id");
        const withThumbanil = req.nextUrl.searchParams.get("withThumbanil");

        if (!albumID) throw new Error("Failed to get album");
        let a;
        if (withThumbanil){
            a = await db.query.album.findFirst({
                where: eq(album.id, albumID),
                with: {
                    thumbnail: true
                }
            })
        }else{
            a = (await db.select().from(album).where(eq(album.id, albumID)).limit(1))[0]
        }

        return NextResponse.json(a, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
