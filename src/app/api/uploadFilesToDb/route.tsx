import { db } from '@/db';
import { media, schema } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { readdirSync } from 'fs';
import { stat } from 'fs/promises';
import { NextRequest } from 'next/server';
import path from 'path';
var mime = require("mime-types");

const uploadFiles = async (filepath: string, mediaRoot: string): Promise<unknown> => {
    return new Promise((resolve, _reject) => {
        readdirSync(filepath).forEach(async (file) => {
            // TODO: Check the dir and/or root so we aren't querying every file
            console.log(file);
            const filename = filepath + "/" + file;

            const stats = await stat(filename);

            if (stats.isDirectory()) {
                uploadFiles(filename, mediaRoot);
            } else {
                const x = filename.replace(mediaRoot, "");
                let dir = path.dirname(x);
                if (!dir.endsWith('/')){
                    dir = dir.concat('/')
                }
                if (dir.startsWith('/')){
                    dir = dir.slice(1);
                }
                const name = path.basename(x);

                const check = await db.select().from(media).where(and(
                    eq(media.mediaRoot, mediaRoot),
                    eq(media.mediaDir, dir),
                    eq(media.mediaFilename, name),
                )).limit(1)

                if (check) {
                    return;
                }

                const m: typeof schema.media.$inferInsert = {
                    mediaFilename: name,
                    mediaDir: dir,
                    mediaRoot: mediaRoot,
                    mediaFilePath: mediaRoot + dir + name,
                    mediaType: mime.lookup(file),
                    mediaSize: stats.size.toString(),
                    mediaCreatedAt: stats.birthtime.toISOString(),
                    mediaUpdatedAt: stats.mtime.toISOString(),
                };

                await db.insert(media).values(m)
            }
        })
        resolve("true");
    })
}

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        const mediaRoot: string | null = body.mediaRoot;
        if (!mediaRoot) throw new Error("Variable not found");

        await uploadFiles(mediaRoot, mediaRoot);

        return new Response('Finished Uploading', { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
