import { MediaType } from '@/_types/type';
import { getType, getVideoData } from '@/utils/util';
import { fileTypeFromFile } from 'file-type';
import { stat } from 'fs/promises';
import { imageSizeFromFile } from 'image-size/fromFile';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        let filePath = req.nextUrl.searchParams.get("filePath");
        console.log(filePath)
        if (!filePath) throw new Error("Failed to get filePath");
        filePath = decodeURI(filePath);
        const stats = await stat(filePath);
        const mimeType = (await fileTypeFromFile(filePath))?.mime || ""
        const type = getType(mimeType);
        let width = 0, height = 0, duration: number | null = null;

        if (type == MediaType.videos) {
            const videoData = await getVideoData(filePath);
            width = videoData.width
            height = videoData.height
            duration = videoData.durationInSecs
        } else {
            const dimensions = await imageSizeFromFile(filePath)
            width = dimensions.width
            height = dimensions.height
        }

        return NextResponse.json({filePath, stats, mimeType, type: MediaType[type], width, height}, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
