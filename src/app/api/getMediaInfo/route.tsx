import { db } from '@/db';
import { media } from '@/db/schema';
import { MediaAll } from '@/db/types';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaID = req.nextUrl.searchParams.get("mediaID");
        if (!mediaID) throw new Error("Failed to get media");

        const m: MediaAll | undefined = await db.query.media.findFirst({
            where: eq(media.id, mediaID),
            with: {
                albums: {
                    with: {
                        album: true
                    }
                }
            },
        })

        if (!m) throw new Error("Failed to get media");

        return NextResponse.json({ media: m }, { status: 200 })

    } catch (err: unknown) {
        console.error(`Error processing request:`);
        console.error(err)
        return new Response(`Internal server error ${JSON.stringify(err)}`, { status: 500 });
    }
}
