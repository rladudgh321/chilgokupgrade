"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SortKey } from "./ListingsShell";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { clsx } from "clsx";

import Pagination from "@/app/components/shared/Pagination";
import ToggleSwitch from "@/app/components/admin/listings/ToggleSwitch";
import AddressVisibility from "@/app/components/admin/listings/AddressVisibility ";
import SearchIcon from "@svg/Search";

import { BuildDeleteSome, BuildFindAll, toggleBuild } from "@/app/apis/build";
import { IBuild } from "@/app/interface/build";
import formatFullKoreanMoney from "@/app/utility/NumberToKoreanMoney";
import { formatYYYYMMDD } from "@/app/utility/koreaDateControl";
import { openPrintSafe } from '@/app/utility/print';

type SearchFormValues = { keyword: string };

interface ListingsMainProps {
  ListingsData: {
    currentPage: number;
    data: Array<IBuild>;
    ok: boolean;
    totalItems: number;
    totalPages: number;
  };
  sortKey: SortKey;
}

type PageData = {
  ok: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: IBuild[];
};

const LIMIT = 10;

const ListingsMain = ({ ListingsData, sortKey }: ListingsMainProps) => {
  const queryClient = useQueryClient();

  // 검색 폼
  const methods = useForm<SearchFormValues>({ defaultValues: { keyword: "" } });
  const { register, handleSubmit } = methods;
  const [searchKeyword, setSearchKeyword] = useState("");

  // 페이지
  const [page, setPage] = useState(ListingsData.currentPage);

  // 선택 삭제 상태
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // 확인일 / 메뉴
  const [confirmDates, setConfirmDates] = useState<Record<number, string | undefined>>({});
  const [menuRowId, setMenuRowId] = useState<number | null>(null); // 확인일 드롭다운
  const [printMenuRowId, setPrintMenuRowId] = useState<number | null>(null); // 프린트 드롭다운
  const today = useMemo(() => formatYYYYMMDD(new Date()), []);

  // Query Key
  const qk = useMemo(
    () => ["builds", page, LIMIT, (searchKeyword ?? "").trim()],
    [page, searchKeyword]
  );

  // 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: qk,
    queryFn: () => BuildFindAll(page, LIMIT, searchKeyword),
    placeholderData: keepPreviousData,
    initialData: ListingsData,
  });

  const rows = useMemo<IBuild[]>(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data as IBuild[];
  }, [data?.data]);

  // ✅ 표시용 정렬 (API는 그대로, 프론트에서만 정렬)
  const sortedRows = useMemo(() => {
    const arr = [...rows];
    switch (sortKey) {
      case "recent":
        return arr.sort(
          (a, b) =>
            new Date(String(b.createdAt)).getTime() -
            new Date(String(a.createdAt)).getTime()
        );
      case "views": // 🔸 ListingsShell과 키 통일
        return arr.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      case "price": {
        const price = (x: any) =>
          Math.max(Number(x.salePrice ?? 0), Number(x.actualEntryCost ?? 0));
        return arr.sort((a, b) => price(b) - price(a));
      }
      case "totalArea":
        return arr.sort(
          (a, b) => Number(b.totalArea ?? 0) - Number(a.totalArea ?? 0)
        );
      default:
        return arr;
    }
  }, [rows, sortKey]);

  // 선택 체크박스 계산은 정렬된 결과 기준
  const allIdsOnPage = useMemo(
    () => sortedRows.map((it) => Number(it.id)).filter(Number.isFinite),
    [sortedRows]
  );
  const allOnThisPageChecked =
    allIdsOnPage.length > 0 && allIdsOnPage.every((id) => selectedIds.includes(id));
  const someOnThisPageChecked = allIdsOnPage.some((id) => selectedIds.includes(id));

  const toggleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)
    );
  };
  const toggleSelectAllOnPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, ...allIdsOnPage]));
      const remove = new Set(allIdsOnPage);
      return prev.filter((id) => !remove.has(id));
    });
  };

  // 삭제 뮤테이션 (낙관적 업데이트)
  const deleteSomeMutation = useMutation({
    mutationFn: (ids: number[]) => BuildDeleteSome(ids),
    onMutate: async (ids) => {
      setIsDeleting(true);
      await queryClient.cancelQueries({ queryKey: qk });
      const prev = queryClient.getQueryData<typeof ListingsData>(qk);
      if (prev) {
        const nextTotalItems = Math.max(0, (prev.totalItems ?? 0) - ids.length);
        const next = {
          ...prev,
          data: prev.data.filter((item: any) => !ids.includes(Number(item.id))),
          totalItems: nextTotalItems,
          totalPages: Math.max(1, Math.ceil(nextTotalItems / LIMIT)),
          currentPage: page,
        };
        queryClient.setQueryData(qk, next);
      }
      setSelectedIds((prevSel) => prevSel.filter((id) => !ids.includes(id)));
      return { prev };
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(qk, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["builds"] });
      setIsDeleting(false);
    },
  });

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    if (!window.confirm(`${selectedIds.length}건을 삭제하시겠습니까?`)) return;
    try {
      const res = await deleteSomeMutation.mutateAsync([...selectedIds]);
      alert(res.message ?? "삭제 완료");
    } catch (e: any) {
      alert(e?.message ?? "삭제 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await deleteSomeMutation.mutateAsync([id]);
      alert(res.message ?? "삭제 완료");
    } catch (e: any) {
      alert(e?.message ?? "삭제 실패");
    }
  };

  // 서버 확인일 초기화
  useEffect(() => {
    const init: Record<number, string | undefined> = {};
    rows.forEach((item: any) => {
      if (item.confirmDate) init[item.id] = item.confirmDate;
    });
    setConfirmDates((prev) => ({ ...init, ...prev }));
  }, [rows]);

  // 검색
  const onSubmit = handleSubmit((formData) => {
    setSearchKeyword(formData.keyword);
    setPage(1);
  });

  // 확인일 로컬 조작
  const addConfirmDate = (id: number) => setConfirmDates((p) => ({ ...p, [id]: today }));
  const updateConfirmDateToToday = (id: number) => {
    setConfirmDates((p) => ({ ...p, [id]: today }));
    setMenuRowId(null);
  };
  const deleteConfirmDate = (id: number) => {
    setConfirmDates((p) => {
      const copy = { ...p };
      delete copy[id];
      return copy;
    });
    setMenuRowId(null);
  };
  const editConfirmDate = (id: number) => {
    const input = window.prompt("2026-01-01 형식으로 작성해주세요");
    if (!input) return;
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(input);
    if (!valid) return alert("형식이 올바르지 않습니다. 예: 2026-01-01");
    const dt = new Date(input);
    if (Number.isNaN(dt.getTime()) || formatYYYYMMDD(dt) !== input) {
      return alert("존재하지 않는 날짜입니다. 예: 2026-01-01");
    }
    setConfirmDates((p) => ({ ...p, [id]: input }));
    setMenuRowId(null);
  };

  // ✨ 프린트 빌더들
  const printPhotoVersion = (listing: IBuild) => {
    const imgs: string[] = [
      listing.mainImage as any,
      ...(Array.isArray(listing.subImage) ? listing.subImage.slice(0, 3) : []),
    ].filter(Boolean);

    const body = `
      <div class="card">
        <div class="h1">매물 #${listing.id} — ${listing.title ?? ""}</div>
        <div class="muted">${listing.address ?? ""}</div>
      </div>

      ${imgs
        .map(
          (src) => `
          <div class="card">
            <img src="${src}" alt="매물 이미지" />
          </div>`
        )
        .join("")}

      <div class="card">
        <div class="row">
          <div>거래: ${listing.dealType ?? "-"}</div>
          <div>종류: ${listing.propertyType ?? "-"}</div>
        </div>
        <div class="row">
          <div>실면적: ${listing.actualArea ?? "-"}평</div>
          <div>공급면적: ${listing.supplyArea ?? "-"}평</div>
        </div>
        <div class="row">
          <div>분양가: ${listing.salePrice ?? "-"}</div>
          <div>실입주금: ${listing.actualEntryCost ?? "-"}</div>
        </div>
        <div class="row">
          <div>층: ${listing.currentFloor ?? "-"}/${listing.totalFloors ?? "-"}</div>
          <div>방/욕실: ${listing.rooms ?? "-"} / ${listing.bathrooms ?? "-"}</div>
        </div>
      </div>
    `;
    openPrintSafe({ title: `매물 #${listing.id}`, bodyHtml: body });
  };

  const printTextVersion = (listing: IBuild) => {
    const adminHas =
      Array.isArray(listing.adminImage) && listing.adminImage.length > 0;
    const body = `
      <div class="card">
        <div class="h1">매물 #${listing.id} — ${listing.title ?? ""}</div>
        <div class="muted">${listing.address ?? ""}</div>
      </div>

      <div class="card">
        <div>거래: ${listing.dealType ?? "-"}</div>
        <div>종류: ${listing.propertyType ?? "-"}</div>
        <div>실면적: ${listing.actualArea ?? "-"}평 / 공급면적: ${listing.supplyArea ?? "-"}평</div>
        <div>층: ${listing.currentFloor ?? "-"}/${listing.totalFloors ?? "-"}</div>
        <div>방/욕실: ${listing.rooms ?? "-"} / ${listing.bathrooms ?? "-"}</div>
        <div>방향: ${listing.direction ?? "-"}</div>
        <div>분양가: ${listing.salePrice ?? "-"}</div>
        <div>전세가: ${listing.rentalPrice ?? "-"}</div>
        <div>실입주금: ${listing.actualEntryCost ?? "-"}</div>
        <div>관리비: ${listing.managementFee ?? "-"}</div>
        <div>관리자용 사진: ${adminHas ? "있음" : "없음"}</div>
      </div>
    `;
    openPrintSafe({ title: `매물 #${listing.id}`, bodyHtml: body });
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <FormProvider {...methods}>
      <div className="flex justify-between items-center">
        <div className="mb-4 max-w-4xl flex items-center">
          <form className="flex h-8 w-full" onSubmit={onSubmit}>
            <div className="border border-slate-500 rounded-l-xl w-full">
              <input
                {...register("keyword")}
                type="text"
                placeholder="매물번호 또는 주소"
                className="h-full px-2 w-full"
              />
            </div>
            <button type="submit">
              <SearchIcon className="w-8 bg-slate-400 rounded-r-xl p-1" />
            </button>
          </form>
        </div>

        <div>
          <button
            onClick={handleBulkDelete}
            disabled={isDeleting || selectedIds.length === 0}
            className={clsx(
              "text-sm text-white px-3 py-1 rounded-lg shadow transition duration-200",
              selectedIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-400"
            )}
          >
            {isDeleting ? "삭제 중..." : `선택 삭제 (${selectedIds.length})`}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-slate-600 text-white">
              <th className="p-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={allOnThisPageChecked}
                  ref={(el) => {
                    if (el)
                      el.indeterminate = !allOnThisPageChecked && someOnThisPageChecked;
                  }}
                  onChange={(e) => toggleSelectAllOnPage(e.currentTarget.checked)}
                  aria-label="이 페이지 전체 선택"
                />
              </th>
              <th className="p-3 text-sm font-medium">매물번호</th>
              <th className="p-3 text-sm font-medium">공개/거래</th>
              <th className="p-3 text-sm font-medium">거래종류</th>
              <th className="p-3 text-sm font-medium">매물종류</th>
              <th className="p-3 text-sm font-medium">주소</th>
              <th className="p-3 text-sm font-medium">매물정보</th>
              <th className="p-3 text-sm font-medium">금액</th>
              <th className="p-3 text-sm font-medium">조회수</th>
              <th className="p-3 text-sm font-medium">등록일</th>
              <th className="p-3 text-sm font-medium">기능</th>
              <th className="p-3 text-sm font-medium">비고</th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((listing: IBuild, index: number) => {
              const id = Number(listing.id);
              const confirmDate = confirmDates[id];
              const createdAtDate = new Date(String(listing.createdAt));
              const updatedAtDate = listing.updatedAt
                ? new Date(String(listing.updatedAt))
                : null;
              const hasUpdate = !!(
                updatedAtDate && updatedAtDate.getTime() > createdAtDate.getTime()
              );

              return (
                <tr
                  key={id}
                  className={clsx(
                    "hover:bg-slate-300 transition-colors duration-300",
                    index % 2 === 0 ? "bg-slate-100" : "bg-slate-200"
                  )}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(id)}
                      onChange={(e) => toggleSelect(id, e.currentTarget.checked)}
                      aria-label={`${id} 선택`}
                    />
                  </td>

                  <td className="p-3">{id}</td>

                  <td className="p-3">
                    <AddressVisibility
                      activeAddressPublic={
                        (listing.isAddressPublic as "public" | "private" | "exclude")
                      }
                      listingId={id}
                      serverSync
                      handleRadioChange={(newState) => {
                        queryClient.setQueryData(qk, (prev: PageData | undefined) => {
                          if (!prev) return prev;
                          return {
                            ...prev,
                            data: prev.data.map((row) =>
                              Number(row.id) === id
                                ? { ...row, isAddressPublic: newState }
                                : row
                            ),
                          };
                        });
                      }}
                    />

                    <div>매물공개여부</div>
                    <ToggleSwitch
                      toggle={!!listing.visibility}
                      id={`visibility-${id}`}
                      onToggle={() => {
                        toggleBuild(listing.id!).catch(() =>
                          alert("매물 공개여부 변경 실패")
                        );
                      }}
                    />
                  </td>

                  <td className="p-3">{listing.dealType}</td>
                  <td className="p-3">{listing.propertyType}</td>

                  <td className="p-3">
                    <div className="max-w-[260px] mx-auto">
                      <span title={listing.address ?? ""}>
                        {listing.address ?? ""}
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
                    <div>{listing.title}</div>
                    <div>
                      방 {listing.rooms} / 화장실 {listing.bathrooms}
                    </div>
                    <div>
                      실면적 {listing.actualArea}평 / 공급면적 {listing.supplyArea}평
                    </div>
                    <div>
                      {listing.direction} / 지상 {listing.currentFloor}/
                      {listing.totalFloors}층
                    </div>
                  </td>

                  <td className="p-3">
                    {listing.salePrice && (
                      <div>분: {formatFullKoreanMoney(Number(listing.salePrice))}</div>
                    )}
                    {listing.rentalPrice && (
                      <div>전: {formatFullKoreanMoney(Number(listing.rentalPrice))}</div>
                    )}
                    {listing.actualEntryCost && (
                      <div>
                        실: {formatFullKoreanMoney(Number(listing.actualEntryCost))}
                      </div>
                    )}
                    {listing.managementFee && (
                      <div>
                        관: {formatFullKoreanMoney(Number(listing.managementFee))}
                      </div>
                    )}
                  </td>

                  <td className="p-3">{listing?.views ?? 0}</td>

                  <td className="p-3">
                    <div>{new Date(String(listing.createdAt)).toLocaleDateString()}</div>

                    {hasUpdate && (
                      <div className="mt-1 text-xs text-rose-600">
                        (수정일: {formatYYYYMMDD(updatedAtDate!)})
                      </div>
                    )}

                    <div className="mt-1 text-xs text-slate-600">
                      현장 확인일: {confirmDates[id] ?? "—"}
                    </div>
                  </td>

                  <td className="p-3 relative">
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                      {/* 프린트 드롭다운 트리거 */}
                      <button
                        type="button"
                        className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200"
                        onClick={() =>
                          setPrintMenuRowId((p) => (p === id ? null : id))
                        }
                      >
                        프린트
                      </button>

                      {/* 프린트 드롭다운 */}
                      {printMenuRowId === id && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-56 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
                          <button
                            type="button"
                            onClick={() => {
                              setPrintMenuRowId(null);
                              printPhotoVersion(listing);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-100"
                          >
                            사진 버전 (대표 + 최대 3장)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPrintMenuRowId(null);
                              printTextVersion(listing);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-100"
                          >
                            텍스트 버전 (사진 없음)
                          </button>
                        </div>
                      )}

                      {/* 확인일 */}
                      {!confirmDate ? (
                        <button
                          onClick={() => addConfirmDate(id)}
                          className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200"
                        >
                          확인일 추가
                        </button>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setMenuRowId((prev) => (prev === id ? null : id))
                            }
                            className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200"
                          >
                            확인일 갱신
                          </button>

                          {menuRowId === id && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-36 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
                              <button
                                onClick={() => updateConfirmDateToToday(id)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                              >
                                확인일 갱신(오늘)
                              </button>
                              <button
                                onClick={() => editConfirmDate(id)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                              >
                                확인일 수정
                              </button>
                              <button
                                onClick={() => deleteConfirmDate(id)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100 text-red-600"
                              >
                                확인일 삭제
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                      <Link
                        href={`/admin/listings/listings/${id}/edit`}
                        className="text-sm text-white bg-green-500 px-3 py-1 rounded-lg shadow hover:bg-green-400 transition duration-200"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                        className={clsx(
                          "text-sm text-white px-3 py-1 rounded-lg shadow transition duration-200",
                          isDeleting
                            ? "bg-red-300 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-400"
                        )}
                      >
                        삭제
                      </button>
                    </div>

                    {/* ▼ 비밀 메모 : 버튼처럼 보이지만 클릭 불가, hover 시 내용 노출 */}
                    <div className="mt-3 relative group flex justify-center">
                      <div
                        aria-hidden
                        className="inline-block select-none px-3 py-1 rounded-md border border-slate-400 bg-white text-slate-700 text-xs font-medium shadow-sm"
                      >
                        비밀 메모
                      </div>

                      <div
                        className="
                          absolute left-1/2 top-full mt-2 -translate-x-1/2 z-20
                          w-64 rounded-md border border-slate-200 bg-white p-3 text-left text-xs text-slate-700 shadow-xl
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        "
                        role="tooltip"
                      >
                        <div className="font-semibold mb-1">비밀 메모</div>
                        <div className="whitespace-pre-line break-words">
                          {listing.secretNote ?? "—"}
                        </div>

                        <div className="font-semibold mt-2 mb-1">비밀 연락처</div>
                        <div className="break-words">{listing.secretContact ?? "—"}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="my-4 flex justify-center">
          <Pagination
            totalPages={data?.totalPages ?? 1}
            currentPage={data?.currentPage ?? page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default ListingsMain;
