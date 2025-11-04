import { db } from '@/db';
import { Album } from '@/db/types';
import { NextResponse } from 'next/server';

export async function GET(
) {
    try {
        let a: Album[] = await db.query.album.findMany({ limit: 50 })
        return NextResponse.json({ albums: a }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request:`);
        console.error(err);
        return new Response(`Internal server error: ${JSON.stringify(err)}`, { status: 500 });
    }
}
