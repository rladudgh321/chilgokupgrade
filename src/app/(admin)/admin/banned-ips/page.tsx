export const dynamic = 'force-dynamic';


import { createClient } from "@/app/utils/supabase/server";
import { cookies } from "next/headers";
import BannedIpList from "./BannedIpList";

// Renamed function to try and break the cache
const getBannedIps = async () => {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("BannedIp")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Failed to fetch banned IPs:", error);
    return [];
  }
};

const BannedIpsPage = async () => {
  const bannedIps = await getBannedIps();

  return (
    <BannedIpList initialBannedIps={bannedIps} />
  );
};

export default BannedIpsPage;
