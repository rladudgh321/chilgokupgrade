import { createClient } from "@/app/utils/supabase/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import AdminBoardEditClient from "./client";

interface AdminBoardEditPageProps {
  params: {
    id: string;
  };
}

const AdminBoardEditPage = async ({ params: { id } }: AdminBoardEditPageProps) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: post, error } = await supabase
    .from("BoardPost")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  const plainPost = {
    ...post,
    registrationDate: new Date(post.registrationDate).toISOString(),
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
  };

  return <AdminBoardEditClient post={plainPost as any} />;
};

export default AdminBoardEditPage;
