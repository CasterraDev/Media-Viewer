import { db } from '@/db';
import { media } from '@/db/schema';
import { and, AnyColumn, asc, desc, gt, ilike, inArray, lt, or, SQLWrapper } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaTypesParam = req.nextUrl.searchParams.getAll("mediaTypes");
        const beforeDateParam = req.nextUrl.searchParams.get("beforeDate");
        const afterDateParam = req.nextUrl.searchParams.get("afterDate");
        const sortingParam = req.nextUrl.searchParams.get("sorting");
        const sortByParam = req.nextUrl.searchParams.get("sortBy");
        const sizeParam = req.nextUrl.searchParams.get("size");
        const searchParam = req.nextUrl.searchParams.get("search");
        const count = req.nextUrl.searchParams.get("count");
        const offset = req.nextUrl.searchParams.get("offset");

        let sortBy: AnyColumn | SQLWrapper = media.mediaCreatedAt
        if (sortByParam == "size") {
            sortBy = media.mediaSize
        }

        const medias = await db.select().from(media).orderBy(sortingParam?.match("descending") ? desc(sortBy) : asc(sortBy)).where(and(
            mediaTypesParam ? inArray(media.mediaType, mediaTypesParam) : undefined,
            afterDateParam ? gt(media.mediaCreatedAt, afterDateParam) : undefined,
            beforeDateParam ? lt(media.mediaCreatedAt, beforeDateParam) : undefined,
            sizeParam ? lt(media.mediaSize, sizeParam) : undefined,
            or(
                searchParam ? ilike(media.title, `%${searchParam}%`) : undefined,
                searchParam ? ilike(media.description, `%${searchParam}%`) : undefined,
                searchParam ? ilike(media.mediaFilePath, `%${searchParam}%`) : undefined,
            )
        )).limit(count ? +count : 10).offset(offset ? +offset : 0)

        if (!medias) throw new Error("Failed to get medias");

        return NextResponse.json({ medias: medias }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
