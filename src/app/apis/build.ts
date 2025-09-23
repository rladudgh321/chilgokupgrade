const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Paginated<T> {
  ok: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Build = Record<string, any>;

// export function BuildFindAll(page:number=1, limit:number=10, keyword?: string) {
//   return fetch(`${baseURL}/api/supabase/build?page=${page}&limit=${limit}&keyword=${keyword ?? ""}`, {
//     method: 'get',
//   }).then((response) => response.json()).catch((err) => console.error(err));
// }

export async function BuildFindAll(
  page: number = 1,
  limit: number = 10,
  keyword?: string,
  opts?: { signal?: AbortSignal }
) {
  const qs = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(keyword?.trim() ? { keyword: keyword.trim() } : {}),
  });

  const res = await fetch(`${baseURL}/api/supabase/build?${qs.toString()}`, {
    method: "GET",
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /api/supabase/build failed (${res.status}): ${text}`);
  }
  return res.json();
}

export async function BuildCreate(data: object){
  const res = await fetch(`${baseURL}/api/supabase/build`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
		body : JSON.stringify(data),
    credentials: 'include',
  });
  if (res.status === 204) {
    console.log("body 없음")
  } else if (!res.headers.get("content-type")?.includes("application/json")) {
    const text = await res.text(); // JSON 아님 → 내용 확인
    throw new Error(`Non-JSON response: ${text.slice(0,200)}...`);
  } else {
    const json = await res.json();
    console.log(json);
  }
}


export const uploadImage = async (formData: FormData) => {
  const res = await fetch(`${baseURL}/image/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("대표 사진 업로드 실패");
  }

  return res.json();
};

export const uploadImages = async (formData: FormData) => {
  const res = await fetch(`${baseURL}/image/uploads`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("사진들 업로드 실패");
  }

  return res.json();
};

export function BuildDelete(id: number){
  return fetch(`${baseURL}/build/${id}`, {
    method: 'delete',
    credentials: 'include',
  }).then((response) => response.json()).catch((err) => console.error('fetch error', err));
}

export async function BuildDeleteSome(ids: number[], opts?: { signal?: AbortSignal }) {
  const res = await fetch(`${baseURL}/api/supabase/build/some`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    signal: opts?.signal,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message ?? "deleteBuildSome 실패");
  return json as { message: string; deletedCount: number; deletedIds: number[]; deletedAt: string };
}

export async function UpdateBuildToggle(id: number, payload: { visibility: boolean }) {
  return fetch(`${baseURL}/build/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error("토글 업데이트 실패");
    return res.json();
  });
}

export async function updateAddressVisibility(id: number, payload: { isAddressPublic: "public" | "private" | "exclude" }) {
  return fetch(`${baseURL}/build/${id}/address-visibility`, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) throw new Error("주소 공개여부 업데이트 실패");
    return res.json();
  });
}
