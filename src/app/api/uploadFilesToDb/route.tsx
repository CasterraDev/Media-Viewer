import { db } from '@/db';
import { media, schema } from '@/db/schema';
import { readdir, stat } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { fileTypeFromFile } from 'file-type'
import { imageSizeFromFile } from 'image-size/fromFile'
import { getType, getVideoData } from '@/utils/util';
import { MediaType } from '@/_types/type';
import { eq } from 'drizzle-orm';
import { FileError } from '@/errors/Files';

type FileErrorReason = { file: string, reason: string }
type PromiseReturn = { newFiles: string[], rejectedFiles: FileErrorReason[], errorFiles: FileErrorReason[] }

const uploadFiles = async (filepath: string, mediaRoot: string): Promise<PromiseReturn> => {
    return new Promise(async (resolve, _reject) => {
        let pf: PromiseReturn = { newFiles: [], rejectedFiles: [], errorFiles: [] }
        let mimeType: string | undefined = undefined;
        let files = await readdir(filepath)

        for (let f in files) {
            let file = files[f]
            let root = ""
            let dir = ""
            let name = ""
            try {
                root = mediaRoot.endsWith('/') ? mediaRoot : mediaRoot + '/'
                const filename = filepath + "/" + file;

                const stats = await stat(filename);

                if (stats.isDirectory()) {
                    let y = await uploadFiles(filename, root);
                    pf.newFiles = pf.newFiles.concat(y.newFiles);
                    pf.rejectedFiles = pf.rejectedFiles.concat(y.rejectedFiles);
                    pf.errorFiles = pf.errorFiles.concat(y.errorFiles);
                } else {
                    const x = filename.replace(root, "");
                    dir = path.dirname(x);
                    if (!dir.endsWith('/')) {
                        dir = dir.concat('/')
                    }
                    if (dir.startsWith('/')) {
                        dir = dir.slice(1);
                    }
                    if (dir == "./") {
                        dir = ""
                    }
                    name = path.basename(x);

                    let check = await db.select().from(media).where(
                        eq(media.mediaFilePath, root + dir + name)
                    );
                    if (check.length > 0) {
                        throw new FileError("101", root + dir + name, "File already in Database. Via matching mediaFilePath.")
                    }

                    mimeType = (await fileTypeFromFile(filename))?.mime
                    // console.log(file + ", " + mimeType)
                    // Return if file is not supported
                    if (!mimeType || mimeType.includes("json")) {
                        throw new FileError("102", root + dir + name, "File type not supported: File: " + file + " Mime: " + mimeType)
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

                    await db.insert(media).values(m).then(() => {
                        pf.newFiles.push(root + dir + name);
                    })
                }
            } catch (error: unknown) {
                // console.log(JSON.stringify(error))
                // isUniqueConstraintError
                if ((error as any)?.cause?.code === '23505') {
                    pf.rejectedFiles.push({ file: root + dir + name, reason: "isUniqueConstraintError" });
                    // console.log(`isUniqueConstraintError Occurred: ${error} File: ${file} MT: ${mimeType}`)
                } else if (error instanceof FileError) {
                    pf.errorFiles.push({ file: root + dir + name, reason: error.cause });
                    // console.log(`Error Occurred: ${error} File: ${file} MT: ${mimeType}`)
                    // console.log((error as any).cause.code)
                }else{
                    console.log(error);
                }
            }
        }
        resolve(pf);
    })
}

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        const mediaRoots: string[] | null = body.mediaRoots;
        if (!mediaRoots) throw new Error("No media roots passed.")

        let pf: PromiseReturn = { newFiles: [], rejectedFiles: [], errorFiles: [] }
        for (let x in mediaRoots) {
            let m = mediaRoots[x]
            let y = await uploadFiles(m, m);
            pf.newFiles = pf.newFiles.concat(y.newFiles);
            pf.rejectedFiles = pf.rejectedFiles.concat(y.rejectedFiles);
            pf.errorFiles = pf.errorFiles.concat(y.errorFiles);
        }
        return NextResponse.json(pf, { status: 200 });
    } catch (err: unknown) {
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
