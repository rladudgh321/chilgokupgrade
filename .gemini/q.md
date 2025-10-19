async function getPost(id: string): Promise<BoardPost> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('BoardPost')
    .select('id, title, content, views, createdAt, registrationDate')
    .eq('id', id)
    .single();

  if (error || !data) {
    notFound();
  }

  return {
    ...data,
    createdAt: new Date(data.createdAt).toISOString(),
    registrationDate: data.registrationDate ? new Date(data.registrationDate).toISOString() : undefined,
  };
}
----------
`NoticeDetailPage`를 수정하려고 하는데, `/api/board/[id]/route.ts`를 만들어서 위와 같은 코드를 fetch로 만들어서 NoticeDetailPage에 fetch로 가지고 오려고 하는데 그렇게 코드를 수정해줘