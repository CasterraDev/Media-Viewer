import { db } from '@/db';
import { media } from '@/db/schema';
import { streamFile } from '@/utils/util';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';
import rangeParser from 'range-parser';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaID = req.nextUrl.searchParams.get("mediaID");
        if (!mediaID) throw new Error("Failed to get media");
        const rangeStart = req.nextUrl.searchParams.get("rangeStart");
        const rangeEnd = req.nextUrl.searchParams.get("rangeEnd");

        const m = (await db.select().from(media).where(eq(media.id, mediaID)).limit(1))[0]

        if (!m) throw new Error("Failed to get media");

        const mediaFilePath = m.mediaFilePath;

        const rangeHeader = req.headers.get('range');

        if (!rangeHeader) {
            const headers = new Headers({
                'Content-Length': m.mediaSize,
                'Content-Type': m.mediaType,
                'Accept-Ranges': 'bytes',
                'Content-Disposition': `inline; filename=${encodeURIComponent(m.mediaFilename)}`
            });

            return new Response(streamFile(mediaFilePath), { status: 200, headers });
        } else {
            let start = 0;
            let end = 0;
            let contentLength = 0;
            // parse the range header
            // using { combine: true } to get one continuous range if possible,
            // simplifying handling for standard video seeking
            if (!rangeStart || !rangeEnd) {
                const ranges = rangeParser(+m.mediaSize, rangeHeader, { combine: true });

                if (ranges === -1) {
                    // unsatisfiable range (e.g., bytes=999999-)
                    return new Response('Range Not Satisfiable', {
                        status: 416,
                        headers: { 'Content-Range': `bytes */${+m.mediaSize}` }
                    });
                } else if (ranges === -2) {
                    // malformed range header
                    return new Response('Malformed Range Header', { status: 400 });
                }

                // we should have a single range object because of { combine: true }
                // if ranges is an empty array, it might mean the header was valid but empty? Treat as malformed.
                if (!ranges || ranges.length === 0 || ranges.type !== 'bytes') {
                    return new Response('Malformed Range Header', { status: 400 });
                }

                const range = ranges[0]; // get the single combined range
                console.log("MEdia: " + m.mediaFilename + ", Start: " + range.start + ", End: " + range.end)
                start = range.start;
                end = range.end;
            } else {
                start = +rangeStart;
                end = +rangeEnd;
            }
            contentLength = end - start + 1;

            // serve partial content (206 Partial Content)
            const headers = new Headers({
                'Content-Range': `bytes ${start}-${end}/${+m.mediaSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength.toString(),
                'Content-Type': m.mediaType
            });
            return new Response(streamFile(mediaFilePath, { start, end }), {
                status: 206,
                headers
            });
        }
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
