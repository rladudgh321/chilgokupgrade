export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, newName, newUrl, imageUrl, imageName } = body;

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    let response;

    if (id && (newName || newUrl)) { // From onEdit
        response = await supabase
            .from("SnsSetting")
            .update({ name: newName, url: newUrl })
            .eq("id", Number(id))
            .select();
    } else if (id && (imageUrl !== undefined || imageName !== undefined)) { // From onImageEdit
        response = await supabase
            .from("SnsSetting")
            .update({ imageUrl, imageName })
            .eq("id", Number(id))
            .select();
    } else {
        return NextResponse.json({ ok: false, error: { message: "Invalid request" } }, { status: 400 });
    }

    const { data, error } = response;

    if (error) {
      Sentry.captureException(error);
      await notifySlack(error, request.url);
        if (error.code === '23505') {
            return NextResponse.json(
                { ok: false, error: { message: "이미 존재하는 설정입니다." } },
                { status: 400 }
              );
        }
      return NextResponse.json({ ok: false, error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data: data[0] }, { status: 200 });

  } catch (e: any) {
    Sentry.captureException(e);
    await notifySlack(e, request.url);
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? "Unknown error" } },
      { status: 500 }
    );
  }
}

---------
`/api/sns-settings/route.ts`폴더인데 newName과 newUrl 수정은 잘되는데 이미지 변경은 잘 안돼.
`/admin/websiteSettings/sns-settings`페이지에서 이미지 변경하면 안되더라고 추가와 제거는 잘 되는데 그러네. 이미지변경이 잘 되게끔 코드를 수정해줘