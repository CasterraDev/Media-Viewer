import { db } from '@/db';
import { media } from '@/db/schema';
import { and, AnyColumn, asc, desc, gt, ilike, inArray, lt, or, sql, SQLWrapper } from 'drizzle-orm';
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
        const searchParam = req.nextUrl.searchParams.getAll("search");
        const count = req.nextUrl.searchParams.get("count");
        const offset = req.nextUrl.searchParams.get("offset");

        let searchArr: SQLWrapper[] = []

        for (let i = 0; i < searchParam.length; i++) {
            let e = searchParam[i];
            e = decodeURI(e);
            e.trim();
            searchArr.push(ilike(media.title, `%${e}%`))
            searchArr.push(ilike(media.description, `%${e}%`))
            searchArr.push(ilike(media.mediaFilePath, `%${e}%`))
        }

        let sortBy: AnyColumn | SQLWrapper = media.mediaCreatedAt
        if (sortByParam == "size") {
            sortBy = media.mediaSize
        }else if (sortByParam == "modified"){
            sortBy = media.mediaUpdatedAt
        }

        const medias = await db.query.media.findMany({
            where: and(
                    mediaTypesParam ? inArray(media.mediaType, mediaTypesParam) : undefined,
                    afterDateParam ? gt(media.mediaCreatedAt, afterDateParam) : undefined,
                    beforeDateParam ? lt(media.mediaCreatedAt, beforeDateParam) : undefined,
                    sizeParam ? lt(media.mediaSize, sizeParam) : undefined,
                    or(
                        ...searchArr,
                    )
                ),
            with: {
                albums: {
                    with: {
                        album: true
                    }
                }
            },
            orderBy: sortingParam?.match("descending") ? desc(sortBy) : sortingParam?.match("random") ? sql`RANDOM()` : asc(sortBy),
            limit: count ? +count : 10,
            offset: offset ? +offset : 0
        })

        if (!medias) throw new Error("Failed to get medias");

        return NextResponse.json({ medias: medias }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
