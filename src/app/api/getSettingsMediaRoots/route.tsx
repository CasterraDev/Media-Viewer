import { db } from '@/db';
import { settings } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
) {
    try {
        let roots: string[] = []
        const m = await db.select({mediaRoots: settings.mediaRoots}).from(settings)
        if (!m) throw new Error("Failed to get media");

        if (m.length > 0 && m[0].mediaRoots){
            roots = m[0].mediaRoots
        }

        return NextResponse.json({ mediaRoots: roots }, { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
