const { data: post, error } = await supabase
    .from("BoardPost")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !post) {
    notFound();
  }
-----------
`AdminBoardEditPage` 컴포넌트에 있는 supabase를 route.ts로 옮겨서 fetch로 가지고 와줘