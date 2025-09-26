import { db } from '@/db';
import { media } from '@/db/schema';
import { and, asc, desc, gt, ilike, inArray, lt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaTypesParam = req.nextUrl.searchParams.getAll("mediaTypes");
        console.log(mediaTypesParam)
        const beforeDate = req.nextUrl.searchParams.get("beforeDate");
        const afterDate = req.nextUrl.searchParams.get("afterDate");
        const sorting = req.nextUrl.searchParams.get("sorting");
        const count = req.nextUrl.searchParams.get("count");
        const offset = req.nextUrl.searchParams.get("offset");

        const medias = await db.select().from(media).orderBy(sorting?.match("descending") ? desc(media.mediaCreatedAt) : asc(media.mediaCreatedAt)).where(and(
            mediaTypesParam ? inArray(media.mediaType, mediaTypesParam) : undefined,
            afterDate ? gt(media.mediaCreatedAt, afterDate) : undefined,
            beforeDate ? lt(media.mediaCreatedAt, beforeDate) : undefined,
        )).limit(count ? +count : 10).offset(offset ? +offset : 0)

        if (!medias) throw new Error("Failed to get media");

        return NextResponse.json({ medias: medias }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
