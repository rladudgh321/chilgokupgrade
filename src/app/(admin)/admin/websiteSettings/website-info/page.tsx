import { cookies } from "next/headers";
import WebsiteInfoForm from "./WebsiteInfoForm";
import { createClient } from "@/app/utils/supabase/server";

async function getWorkInfo() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data } = await supabase
    .from("WorkInfo")
    .select("*")
    .eq("id", "main")
    .single();
  
    return data;
  } catch (error) {
    console.error("Error fetching work info on server:", error);
    return null;
  }
}

export default async function WebsiteInfoPage() {
  const workInfo = await getWorkInfo();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">웹사이트 정보 관리</h1>
        <WebsiteInfoForm initialData={workInfo} />
      </div>
    </div>
  );
}