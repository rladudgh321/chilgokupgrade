import { NextRequest, NextResponse } from 'next/server';
import { Upload } from '@aws-sdk/lib-storage';
import { S3client, PUBLIC_BUCKET, supabasePublicUrl, makeObjectKey } from '@/app/api/supabase/S3';
import * as Sentry from "@sentry/nextjs";
import { notifySlack } from "@/app/utils/sentry/slack";
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const bucketFromForm = form.get('bucket') as string | null;
    const prefix = (form.get('prefix') as string) || 'sub';

    const bucket = bucketFromForm || PUBLIC_BUCKET;  // ✅ 기본값
    if (!bucket) {
      return NextResponse.json({ message: 'Bucket not configured' }, { status: 500 });
    }

    const files: File[] = [];
    for (const [name, val] of form.entries()) {
      if (val instanceof File && (name === 'files' || name === 'file' || name === 'file1' || name === 'file2')) {
        files.push(val);
      }
    }
    if (files.length === 0) {
      return NextResponse.json({ message: '업로드할 파일이 없습니다.' }, { status: 400 });
    }

    const out: { key: string; url: string }[] = [];

    for (const f of files) {
      const Key = makeObjectKey(f.name, prefix);
      const Body = new Uint8Array(await f.arrayBuffer()); // 간단/안정

      const uploader = new Upload({
        client: S3client,
        params: {
          Bucket: bucket,          // ✅ 반드시 채워짐
          Key,
          Body,
          ContentType: f.type || 'application/octet-stream',
        },
        queueSize: 4,
        partSize: 10 * 1024 * 1024,
        leavePartsOnError: false,
      });

      await uploader.done();
      out.push({ key: Key, url: supabasePublicUrl(bucket, Key) });
    }

    return NextResponse.json({
      bucket,
      keys: out.map(o => o.key),
      urls: out.map(o => o.url),
    });
  } catch (e: any) {
    Sentry.captureException(e);
    await notifySlack(e, req.url);
    return NextResponse.json({ message: e?.message ?? '업로드 실패' }, { status: 500 });
  }
}
