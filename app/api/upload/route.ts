import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@clerk/nextjs/server';
import { Buffer } from 'buffer';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const rawPath = formData.get('path')?.toString();
    const path = rawPath?.startsWith('uploads/') ? rawPath : `uploads/${rawPath || Date.now()}`;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'Invalid file upload' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Missing BLOB_READ_WRITE_TOKEN' }, { status: 500 });
    }

    const arrayBuffer = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { url, pathname } = await put(path, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: (file as File).type || undefined,
      addRandomSuffix: true,
    });

    return NextResponse.json({ url, pathname });
  } catch (error) {
    const safeError =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : { message: String(error) };
    console.error('Upload error', safeError);
    return NextResponse.json(
      {
        error: 'Upload failed',
        detail: safeError,
      },
      { status: 500 },
    );
  }
}
