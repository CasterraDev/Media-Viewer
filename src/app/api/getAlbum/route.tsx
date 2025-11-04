import { db } from '@/db';
import { album } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function GET(
    req: NextRequest,
) {
    try {
        const albumID = req.nextUrl.searchParams.get("id");
        const withThumbanil = req.nextUrl.searchParams.get("withThumbanil")?.toString();
        const withMedias = req.nextUrl.searchParams.get("withMedias")?.toString();

        if (!albumID) throw new Error("Failed to get album");

        let p: Parameters<typeof db['query']['album']['findFirst']>[0] = {
            where: eq(album.id, albumID),
        }

        if (withThumbanil == "true" && withMedias == "true") {
            p.with = { thumbnail: true, medias: { with: { media: true } } }
        } else if (withThumbanil == "true") {
            p.with = { thumbnail: true }
        } else if (withMedias == "true") {
            p.with = { medias: { with: { media: true } } }
        }

        let a = await db.query.album.findFirst(p)

        return NextResponse.json(a, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request:`);
        console.error(err);
        return new Response(`Internal server error: ${JSON.stringify(err)}`, { status: 500 });
    }
}
