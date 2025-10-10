import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3client, PUBLIC_BUCKET, supabasePublicUrl, makeObjectKey } from "@/app/api/supabase/S3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const label = formData.get('label') as string | null;
    const bucket = (formData.get('bucket') as string) || PUBLIC_BUCKET;
    const prefix = (formData.get('prefix') as string) || 'building-options';

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: { message: 'file 필드가 필요합니다.' } }, { status: 400 });
    }
    if (!label) {
      return NextResponse.json({ ok: false, error: { message: '라벨이 필요합니다.' } }, { status: 400 });
    }

    const Key = makeObjectKey(file.name, prefix);
    const Body = new Uint8Array(await file.arrayBuffer());

    await S3client.send(new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body,
      ContentType: file.type || 'application/octet-stream',
    }));

    const url = supabasePublicUrl(bucket, Key);

    return NextResponse.json({
      ok: true,
      message: '이미지가 성공적으로 업로드되었습니다.',
      data: { label: label.trim(), imageUrl: url, imageName: Key, bucket }
    }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: { message: e?.message ?? 'Unknown error' } }, { status: 500 });
  }
}
