const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

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

export function BuildDeleteSome(ids: number[]) {
  return fetch(`${baseURL}/build/some`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }), // 👈 반드시 이렇게!
  })
    .then((res) => res.json())
    .catch((err) => console.error('fetch error', err));
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

export function BuildFindAll(page:number=1, limit:number=10, keyword?: string) {
  return fetch(`${baseURL}/build?page=${page}&limit=${limit}&keyword=${keyword ?? ""}`, {
    method: 'get',
    credentials: 'include',
  }).then((response) => response.json()).catch((err) => console.error(err));
}