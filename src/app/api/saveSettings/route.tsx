import { db } from '@/db';
import { NextRequest } from 'next/server';

export async function POST(
    req: NextRequest,
) {
    try {
        const body = await req.json()
        const mediaRoot: string | null = body.mediaRoot;
        if (!mediaRoot) throw new Error("Variable not found");

        return new Response('Finished Uploading', { status: 200 });
    } catch (err: unknown) {
        console.error(`Error processing request: ${err}`);
        return new Response('Internal server error', { status: 500 });
    }
}
