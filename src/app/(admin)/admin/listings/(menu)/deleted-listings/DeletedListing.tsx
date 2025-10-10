"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import Pagination from "@/app/components/shared/Pagination";
import ToggleSwitch from "@/app/components/admin/listings/ToggleSwitch";
import { BuildFindAllDeleted, BuildHardDelete, BuildRestore } from "@/app/apis/build";
import { clsx } from "clsx";
import { IBuild } from "@/app/interface/build";
import formatFullKoreanMoney from "@/app/utility/NumberToKoreanMoney";
import CopyText from "@/app/utility/Copy";
import SearchIcon from "@svg/Search";
import AddressVisibility from "@/app/components/admin/listings/AddressVisibility";

// 🔹 추가: 정렬 키 타입
export type SortKey = "recent" | "views" | "price" | "totalArea";

type SearchFormValues = { keyword: string };
const LIMIT = 10;

interface Paginated<T> {
  ok: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

interface DeletedListingsProps {
  DeletedData: Paginated<IBuild>;
  sortKey: SortKey; // 🔹 추가
}

const DeletedListings = ({ DeletedData, sortKey }: DeletedListingsProps) => {
  const queryClient = useQueryClient();
  const methods = useForm<SearchFormValues>({ defaultValues: { keyword: "" } });
  const { register, handleSubmit } = methods;

  const [page, setPage] = useState(DeletedData?.currentPage ?? 1);
  const [keyword, setKeyword] = useState("");

  const qk = useMemo(
    () => ["builds-deleted", page, LIMIT, (keyword ?? "").trim()],
    [page, keyword]
  );

  const shouldUseInitial =
    (DeletedData?.currentPage ?? 1) === page && (keyword ?? "") === "";

  const { data, isLoading, isError } = useQuery({
    queryKey: qk,
    queryFn: () => BuildFindAllDeleted(page, LIMIT, keyword),
    placeholderData: keepPreviousData,
    initialData: shouldUseInitial ? DeletedData : undefined,
    staleTime: 10_000,
  });

  const rows = useMemo<IBuild[]>(
    () => (Array.isArray(data?.data) ? (data!.data as IBuild[]) : []),
    [data]
  );

  // 🔹 프론트 정렬 (현재 페이지 내에서만)
  const sortedRows = useMemo(() => {
    const arr = [...rows];
    switch (sortKey) {
      case "recent":
        return arr.sort(
          (a, b) =>
            new Date(String(b.createdAt)).getTime() -
            new Date(String(a.createdAt)).getTime()
        );
      case "views":
        return arr.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
      case "price": {
        const price = (x: IBuild) =>
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

  const onSubmit = handleSubmit((formData) => {
    setKeyword(formData.keyword);
    setPage(1);
  });

  type PageData = Paginated<IBuild>;

  const optimisticallyRemove = (id: number) => {
    const prev = queryClient.getQueryData<PageData>(qk);
    if (!prev) return prev;
    const nextTotal = Math.max(0, (prev.totalItems ?? 0) - 1);
    const next: PageData = {
      ...prev,
      data: prev.data.filter((x) => Number(x.id) !== id),
      totalItems: nextTotal,
      totalPages: Math.max(1, Math.ceil(nextTotal / LIMIT)),
      currentPage: prev.currentPage,
    };
    queryClient.setQueryData(qk, next);
    return prev;
  };

  const restoreMutation = useMutation({
    mutationFn: (id: number) => BuildRestore(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const backup = optimisticallyRemove(id);
      return { backup };
    },
    onError: (_e, _id, ctx) => { if (ctx?.backup) queryClient.setQueryData(qk, ctx.backup); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["builds-deleted"] }); },
  });

  const hardDeleteMutation = useMutation({
    mutationFn: (id: number) => BuildHardDelete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: qk });
      const backup = optimisticallyRemove(id);
      return { backup };
    },
    onError: (_e, _id, ctx) => { if (ctx?.backup) queryClient.setQueryData(qk, ctx.backup); },
    onSettled: () => { queryClient.invalidateQueries({ queryKey: ["builds-deleted"] }); },
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <FormProvider {...methods}>
      {/* 상단바 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <div className="w-full sm:max-w-xs flex items-center">
          <form className="flex h-8 w-full" onSubmit={onSubmit}>
            <div className="border border-slate-500 rounded-l-xl w-full">
              <input
                {...register("keyword")}
                type="text"
                placeholder="매물번호 또는 주소"
                className="h-full px-2 w-full rounded-l-xl"
              />
            </div>
            <button type="submit">
              <SearchIcon className="w-8 bg-slate-400 rounded-r-xl p-1 h-full" />
            </button>
          </form>
        </div>
        <div className="text-sm text-slate-600">삭제된 매물 목록</div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-slate-600 text-white">
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">매물번호</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">공개/거래</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">거래종류</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">매물종류</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">주소</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">매물정보</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">금액</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">조회수</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">등록일<br />(수정일)</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">삭제일</th>
              <th className="p-2 sm:p-3 text-xs sm:text-sm font-medium">비고</th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((listing: IBuild, index: number) => {
              const id = Number(listing.id);
              const createdAt = new Date(String(listing.createdAt));
              const updatedAt = listing.updatedAt ? new Date(String(listing.updatedAt)) : null;
              const showUpdated = !!(updatedAt && updatedAt.getTime() !== createdAt.getTime());

              return (
                <tr
                  key={id}
                  className={clsx(
                    "hover:bg-slate-300 transition-colors duration-300",
                    index % 2 === 0 ? "bg-slate-100" : "bg-slate-200",
                  )}
                >
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{id}</td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <AddressVisibility
                      activeAddressPublic={listing.isAddressPublic as "public" | "private" | "exclude"}
                      listingId={id}
                      serverSync={false}
                      disabled
                      handleRadioChange={() => {}}
                    />
                    <div className="mt-1 text-xs text-slate-500">(수정 불가)</div>

                    <ToggleSwitch
                      toggle={!!listing.visibility}
                      id={`visibility-${id}`}
                      onToggle={() => {}}
                      className="pointer-events-none opacity-50 cursor-not-allowed"
                    />
                  </td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{listing.dealType}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{listing.propertyType}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm"><CopyText text={listing.address ?? ""} /></td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <div>{listing.title}</div>
                    <div>방 {listing.rooms} / 화장실 {listing.bathrooms}</div>
                    <div>실면적 {listing.actualArea}평 / 공급면적 {listing.supplyArea}평</div>
                    <div>{listing.direction} / 지상 {listing.currentFloor}/{listing.totalFloors}층</div>
                  </td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    {listing.salePrice && <div>분: {formatFullKoreanMoney(Number(listing.salePrice))}</div>}
                    {listing.rentalPrice && <div>전: {formatFullKoreanMoney(Number(listing.rentalPrice))}</div>}
                    {listing.actualEntryCost && <div>실: {formatFullKoreanMoney(Number(listing.actualEntryCost))}</div>}
                    {listing.managementFee && <div>관: {formatFullKoreanMoney(Number(listing.managementFee))}</div>}
                  </td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{listing?.views ?? 0}</td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <div>{createdAt.toLocaleDateString()}</div>
                    {showUpdated && (
                      <div>({updatedAt!.toLocaleDateString()})</div>
                    )}
                  </td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    {listing?.deletedAt ? new Date(String(listing.deletedAt)).toLocaleDateString() : "-"}
                  </td>

                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    <div className="flex gap-2 justify-center flex-col">
                      <button
                        onClick={() => {
                          if (!window.confirm("이 매물을 복원할까요?")) return;
                          restoreMutation.mutate(id, { onSuccess: (r) => alert(r.message ?? "복원 완료") });
                        }}
                        disabled={restoreMutation.isPending}
                        className="text-xs text-white bg-green-600 px-2 py-1 rounded hover:bg-green-500 disabled:opacity-50"
                      >
                        복원하기
                      </button>
                      <button
                        onClick={() => {
                          if (!window.confirm("영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;
                          hardDeleteMutation.mutate(id, { onSuccess: (r) => alert(r.message ?? "영구 삭제 완료") });
                        }}
                        disabled={hardDeleteMutation.isPending}
                        className="text-xs text-white bg-red-600 px-2 py-1 rounded hover:bg-red-500 disabled:opacity-50"
                      >
                        영구 삭제
                      </button>
                    </div>

                    {/* ▼ 비밀 메모 : 버튼처럼 보이지만 클릭 불가, hover 시 내용 노출 */}
                    <div className="mt-3 relative group flex justify-center">
                      {/* pseudo-button */}
                      <div
                        aria-hidden
                        className="inline-block select-none px-3 py-1 rounded-md border border-slate-400 bg-white text-slate-700 text-xs font-medium shadow-sm"
                      >
                        비밀 메모
                      </div>

                      {/* hover card */}
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
                        <div className="break-words">
                          {listing.secretContact ?? "—"}
                        </div>
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
            currentPage={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default DeletedListings;
