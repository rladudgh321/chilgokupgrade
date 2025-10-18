// app/(app)/@modal/(.)build/[id]/page.tsx  (Server Component)
import BuildDetailModalClient from '@/app/components/root/BuildDetailModal';
import { IBuild } from "@/app/interface/build";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

async function getBuild(id: number): Promise<IBuild> {
  const res = await fetch(`${BASE_URL}/api/supabase/build/${id}`, {
    next: { revalidate: 60, tags: ["build", `build:${id}`] }, // ISR/태그(원하시는 정책으로 조정)
  });
  if (!res.ok) throw new Error("Build fetch failed");
  return res.json();
}

export default async function ModalPage({ params }: { params: { id: string } }) {
  const buildId = Number(params.id);
  const build = await getBuild(buildId); // ✅ 서버에서 await로 패칭
  return <BuildDetailModalClient build={build} />;
}
