import type { Metadata } from "next";
import Header from "../layout/app/Header";
import Footer from "../layout/app/Footer";
import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import SnsIcon from "@/app/components/SnsIcon";

const getWorkInfo = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("WorkInfo")
    .select("*")
    .eq("id", "main")
    .single();
  return data;
};

const getSnsSettings = async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("SnsSetting")
    .select("*")
    .order("order", { ascending: true });
  return data;
};

export const metadata: Metadata = {
  title: "다부 부동산",
  description: "수정 사항 있을시 편히 말씀해주세요",
};

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const workInfo = await getWorkInfo();
  const snsSettings = await getSnsSettings();
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      {Boolean(snsSettings?.length) && <SnsIcon snsSettings={snsSettings} />}
      <Footer workInfo={workInfo} />
    </>
  );
}
