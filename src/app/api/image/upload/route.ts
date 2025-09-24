/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/image/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3client, PUBLIC_BUCKET, supabasePublicUrl, makeObjectKey } from '@/app/api/supabase/S3';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const bucket = (form.get('bucket') as string) || PUBLIC_BUCKET;
    const prefix = (form.get('prefix') as string) || 'main';

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'file 필드가 필요합니다.' }, { status: 400 });
    }

    const Key = makeObjectKey(file.name, prefix);
    const Body = new Uint8Array(await file.arrayBuffer()); // ✅ 핵심

    await S3client.send(new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body,                                 // ✅ 타입 에러 해결
      ContentType: file.type || 'application/octet-stream',
    }));

    const url = supabasePublicUrl(bucket, Key);
    return NextResponse.json({ bucket, key: Key, url });
  } catch (e: any) {
    console.error('upload error', e);
    return NextResponse.json({ message: e?.message ?? '업로드 실패' }, { status: 500 });
  }
}
