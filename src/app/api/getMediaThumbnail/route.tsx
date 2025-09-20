import { db } from '@/db';
import { streamFile } from '@/utils/util';
import { NextRequest } from 'next/server';
import rangeParser from 'range-parser';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaID = req.nextUrl.searchParams.get("mediaID");

        const media = await db.query.media.findFirst({
            with: {
                id: mediaID
            }
        })

        if (!media) throw new Error("Failed to get media");

        const mediaPath = media.mediaRoot + "/" + media.mediaDir + "/" + media.mediaFilename;
        const rangeHeader = req.headers.get('range');

        if (!media.mediaType.includes("video") && rangeHeader !== null){
            const headers = new Headers({
                'Content-Length': media.mediaSize,
                'Content-Type': media.mediaType,
                'Accept-Ranges': 'bytes',
                'Content-Disposition': `inline; filename=${media.mediaFilename}`
            });

            return new Response(streamFile(mediaPath), { status: 200, headers });
        }else{
            if (!rangeHeader) throw new Error("Failed to get media ranges");
            // parse the range header
            // using { combine: true } to get one continuous range if possible,
            // simplifying handling for standard video seeking
            const ranges = rangeParser(+media.mediaSize, rangeHeader, { combine: true });

            if (ranges === -1) {
                // unsatisfiable range (e.g., bytes=999999-)
                return new Response('Range Not Satisfiable', {
                    status: 416,
                    headers: { 'Content-Range': `bytes */${media.mediaSize}` }
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
            const start = range.start;
            const end = range.end;
            const contentLength = end - start + 1;

            // serve partial content (206 Partial Content)
            const headers = new Headers({
                'Content-Range': `bytes ${start}-${end}/${media.mediaSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength.toString(),
                'Content-Type': media.mediaType
            });
            return new Response(streamFile(mediaPath, { start, end }), {
                status: 206,
                headers
            });
        }
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
