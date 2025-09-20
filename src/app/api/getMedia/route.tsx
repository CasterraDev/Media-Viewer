import { db } from '@/db';
import { media } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createReadStream, type ReadStream } from 'fs';
import { stat } from 'fs/promises';
import { NextRequest } from 'next/server';
import rangeParser from 'range-parser';

export async function GET(
    req: NextRequest,
) {
    try {
        const mediaID = req.nextUrl.searchParams.get("mediaID");
        if (!mediaID) throw new Error("Failed to get media");

        const m = (await db.select().from(media).where(eq(media.id, mediaID)).limit(1))[0]

        // const media = await db.query.media.findFirst({
        //     with: {
        //         id: mediaID
        //     }
        // })

        if (!m) throw new Error("Failed to get media");

        const mediaFilePath = m.mediaFilePath;

        const stats = await stat(mediaFilePath);
        const rangeHeader = req.headers.get('range');

        if (!rangeHeader) {
            const headers = new Headers({
                'Content-Length': m.mediaSize,
                'Content-Type': m.mediaType,
                'Accept-Ranges': 'bytes',
                'Content-Disposition': `inline; filename=${m.mediaFilename}`
            });

            return new Response(streamFile(mediaFilePath), { status: 200, headers });
        } else {
            // parse the range header
            // using { combine: true } to get one continuous range if possible,
            // simplifying handling for standard video seeking
            const ranges = rangeParser(stats.size, rangeHeader, { combine: true });

            if (ranges === -1) {
                // unsatisfiable range (e.g., bytes=999999-)
                return new Response('Range Not Satisfiable', {
                    status: 416,
                    headers: { 'Content-Range': `bytes */${stats.size}` }
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
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
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

// https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#convert_an_iterator_or_async_iterator_to_a_stream
function iteratorToStream(
    iterator: AsyncGenerator<Uint8Array, void, unknown>
): ReadableStream {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await iterator.next();

            if (value) {
                controller.enqueue(value);
            }
            if (done) {
                controller.close();
            }
        }
    });
}

async function* nodeStreamToIterator(stream: ReadStream) {
    for await (const chunk of stream) {
        yield new Uint8Array(chunk);
    }
}

function streamFile(
    filePath: string,
    options?: { start?: number; end?: number }
): ReadableStream {
    return iteratorToStream(
        nodeStreamToIterator(createReadStream(filePath, options))
    );
}
