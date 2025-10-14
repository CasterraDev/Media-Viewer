import { db } from '@/db';
import { album } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        let a = await db.query.album.findMany({
        })
        return NextResponse.json({ albums: a }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response(`Internal server error: ${err}`, { status: 500 });
    }
}
