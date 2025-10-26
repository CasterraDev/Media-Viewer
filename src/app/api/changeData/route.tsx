import { db } from '@/db';
import { album, media, mediasToAlbums } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { and, eq, ilike, inArray, sql, SQL } from 'drizzle-orm';
import { Media } from '@/db/types';

function makeStr(s: string, words: string[], old: string): string | boolean {
    console.log(s);
    let indexes: { start: number, end: number }[] = []
    let x = s;

    let index = 0;
    while (index != -1) {
        index = s.indexOf("{", index);
        if (index != -1) {
            let y = s.indexOf("}", index);
            if (y == -1) return false;
            indexes.push({ start: index, end: y });
            index++;
        }
    }

    let wordRegex: RegExp = new RegExp("{words\[[0-9]*\]}")
    let oldRegex: RegExp = new RegExp("{old}")
    for (let i = 0; i < indexes.length; i++) {
        const e = indexes[i];
        let sub = s.substring(e.start + 1, e.end);
        console.log("Sub: " + sub)

        if (sub.includes("old")) {
            if (old.endsWith("/")){
                old = old.slice(0, -1)
            }
            x = x.replace(oldRegex, old)
            console.log("Old: " + x);
        } else if (sub.includes("words")) {
            let is = s.indexOf("[", e.start);
            let os = s.indexOf("]", e.start);
            let num: number = parseInt(s.substring(is + 1, os));
            console.log(num)
            x = x.replace(wordRegex, words[num])
            console.log("String: " + x);
        }
    }

    return x;
}

export async function POST(
    req: NextRequest,
) {
    try {
        let rootWords: string[] = []
        let dirWords: string[] = []
        let fileWords: string[] = []

        const body = await req.formData();

        const oldRoot = body.get("mediaRoot")?.toString();
        const oldDir = body.get("mediaDir")?.toString();
        const oldFile = body.get("mediaFilename")?.toString();

        const newRoot = body.get("mediaRoot-change")?.toString();
        const newDir = body.get("mediaDir-change")?.toString();
        const newFile = body.get("mediaFilename-change")?.toString();

        let reg: RegExp = new RegExp("{word.*}|{old}")

        let nRoot: string | boolean = "";
        let nDir: string | boolean = "";
        let nFile: string | boolean = "";

        const oldMedia = await db.select().from(media).where(and(
            oldRoot ? ilike(media.mediaRoot, oldRoot) : undefined,
            oldDir ? ilike(media.mediaDir, oldDir) : undefined,
            oldFile ? ilike(media.mediaFilename, oldFile) : undefined,
        ))

        const sqlRoots: SQL[] = [];
        sqlRoots.push(sql`(case`);
        const sqlDirs: SQL[] = [];
        sqlDirs.push(sql`(case`);
        const sqlFiles: SQL[] = [];
        sqlFiles.push(sql`(case`);
        const sqlPaths: SQL[] = [];
        sqlPaths.push(sql`(case`);
        const ids: string[] = [];

        for (let om in oldMedia) {
            if (newRoot?.match(reg)) {
                let or = oldRoot
                if (oldRoot && oldRoot[0] == "/") {
                    or = oldRoot?.slice(1);
                }
                rootWords = or?.split("/") || []
                nRoot = makeStr(newRoot, rootWords, oldMedia[om].mediaRoot)
            }

            if (newDir?.match(reg)) {
                dirWords = oldDir?.split("/") || []
                nDir = makeStr(newDir, dirWords, oldMedia[om].mediaDir)
            }

            if (newFile?.match(reg)) {
                // TODO: Change this sep to be a userPrefs. Defaulted to -
                fileWords = oldFile?.split("-") || []
                nFile = makeStr(newFile, fileWords, oldMedia[om].mediaFilename)
            }

            console.log("Root")
            for (let x in rootWords) {
                console.log(rootWords[x]);
            }
            console.log("Dir")
            for (let x in dirWords) {
                console.log(dirWords[x]);
            }
            console.log("File")
            for (let x in fileWords) {
                console.log(fileWords[x]);
            }
            let a: Partial<Media> = {}
            let filepath: string = "";
            if (typeof nRoot == "string" && nRoot != "") {
                a.mediaRoot = nRoot as string
                filepath = filepath.concat(nRoot);
            } else {
                filepath = filepath.concat(oldMedia[om].mediaRoot)
            }
            if (typeof nDir == "string" && nDir != "") {
                a.mediaDir = nDir as string
                filepath = filepath.concat(nDir);
            } else {
                filepath = filepath.concat(oldMedia[om].mediaDir)
            }
            if (typeof nFile == "string" && nFile != "") {
                a.mediaFilename = nFile as string
                filepath = filepath.concat(nFile);
            } else {
                filepath = filepath.concat(oldMedia[om].mediaFilename)
            }
            a.mediaFilePath = filepath
            sqlRoots.push(sql`when ${media.id} = ${oldMedia[om].id} then ${a.mediaRoot}`);
            sqlDirs.push(sql`when ${media.id} = ${oldMedia[om].id} then ${a.mediaDir}`);
            sqlFiles.push(sql`when ${media.id} = ${oldMedia[om].id} then ${a.mediaFilename}`);
            sqlPaths.push(sql`when ${media.id} = ${oldMedia[om].id} then ${a.mediaFilePath}`);
            ids.push(oldMedia[om].id);
        }
        sqlRoots.push(sql`end)`);
        sqlDirs.push(sql`end)`);
        sqlFiles.push(sql`end)`);
        sqlPaths.push(sql`end)`);
        const finalRoots: SQL = sql.join(sqlRoots, sql.raw(' '));
        const finalDirs: SQL = sql.join(sqlDirs, sql.raw(' '));
        const finalFiles: SQL = sql.join(sqlFiles, sql.raw(' '));
        const finalPaths: SQL = sql.join(sqlPaths, sql.raw(' '));

        let m: any = {}

        if (newRoot){
            m.mediaRoot = finalRoots
        }
        if (newDir){
            m.mediaDir = finalDirs
        }
        if (newFile){
            m.mediaFilename = finalFiles
        }
        m.mediaFilePath = finalPaths;

        const res = await db.update(media).set(m).where(inArray(media.id, ids))

        return NextResponse.json({}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        console.dir(err);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
