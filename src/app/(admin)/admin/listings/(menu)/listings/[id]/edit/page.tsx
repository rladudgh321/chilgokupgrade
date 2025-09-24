// app/(admin)/listings/[id]/edit/page.tsx
import EditClient from "./EditClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;     // ✅ Next.js 15: await 필요
  const idNum = Number(id);

  if (!Number.isInteger(idNum) || idNum <= 0) {
    return <div>잘못된 매물 ID</div>;
  }

  return <EditClient id={idNum} />;
}
