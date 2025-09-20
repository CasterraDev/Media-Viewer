import { db } from '@/db';
import { media } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaPath = req.nextUrl.searchParams.get("mediaPath");

        const m = await db.select().from(media).where(and(
            
        ))

        if (!m) throw new Error("Failed to get media");

        const headers = new Headers({
            'Content-Type': m.mediaType,
            'Accept-Ranges': 'bytes',
            'Content-Disposition': `inline; filename=${m.mediaFilename}`
        });

        return NextResponse.json({ media: m }, { status: 200, headers });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
