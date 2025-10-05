import { db } from '@/db';
import { media, schema } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { readdirSync } from 'fs';
import { stat } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileTypeFromFile } from 'file-type'
import { imageSizeFromFile } from 'image-size/fromFile'
import { getType, getVideoData } from '@/utils/util';
import { MediaType } from '@/_types/type';

const uploadFiles = async (filepath: string, mediaRoot: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        let newFiles = 0;
        let mimeType: string | undefined = undefined;
        readdirSync(filepath).forEach(async (file) => {
            try {
                const root = mediaRoot.endsWith('/') ? mediaRoot : mediaRoot + '/'
                const filename = filepath + "/" + file;

                const stats = await stat(filename);

                if (stats.isDirectory()) {
                    newFiles += await uploadFiles(filename, root);
                } else {
                    const x = filename.replace(root, "");
                    let dir = path.dirname(x);
                    if (!dir.endsWith('/')) {
                        dir = dir.concat('/')
                    }
                    if (dir.startsWith('/')) {
                        dir = dir.slice(1);
                    }
                    const name = path.basename(x);

                    const check = await db.select().from(media).where(and(
                        eq(media.mediaRoot, root),
                        eq(media.mediaDir, dir),
                        eq(media.mediaFilename, name),
                    )).limit(1)

                    if (check.length > 0) {
                        return;
                    }

                    mimeType = (await fileTypeFromFile(filename))?.mime
                    console.log(file + ", " + mimeType)
                    // Return if file is not supported
                    if (!mimeType || mimeType.includes("json")) {
                        console.error("File type not supported: File: " + file + " Mime: " + mimeType)
                        return
                    }

                    const type = getType(mimeType)
                    let width = 0, height = 0, duration: number | null = null;

                    if (type == MediaType.videos) {
                        const videoData = await getVideoData(filename);
                        width = videoData.width
                        height = videoData.height
                        duration = videoData.durationInSecs
                    } else {
                        const dimensions = await imageSizeFromFile(filename)
                        width = dimensions.width
                        height = dimensions.height
                    }

                    const m: typeof schema.media.$inferInsert = {
                        mediaFilename: name,
                        mediaDir: dir,
                        mediaRoot: root,
                        mediaFilePath: root + dir + name,
                        mediaType: MediaType[type],
                        mediaMime: mimeType,
                        mediaWidth: width,
                        mediaHeight: height,
                        mediaSize: stats.size.toString(),
                        mediaCreatedAt: stats.birthtime.toISOString(),
                        mediaUpdatedAt: stats.mtime.toISOString(),
                    };
                    if (duration) {
                        m.mediaDurationInSecs = duration;
                    }

                    await db.insert(media).values(m)
                }
            } catch (error) {
                console.log(`Error Occurred: ${error} File: ${file} MT: ${mimeType}`)
                reject(`Error Occurred: ${error} File: ${file} MT: ${mimeType}`);
            }
        })
        resolve(newFiles);
    })
}

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        const mediaRoots: string[] | null = body.mediaRoots;
        if (!mediaRoots) throw new Error("No media roots passed.")

        mediaRoots.map(async (m) => {
            console.log("Root: " + m)
            await uploadFiles(m, m);
        })

        return new Response('Success', { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
