"use client";

import { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import Pagination from "@/app/components/shared/_Pagination";
import ToggleSwitch from "@/app/components/admin/listings/ToggleSwitch";
import { BuildFindAllDeleted, BuildHardDelete, BuildRestore, toggleBuild } from "@/app/apis/build";
import { clsx } from "clsx";
import { IBuild } from "@/app/interface/build";
import formatFullKoreanMoney from "@/app/utility/NumberToKoreanMoney";
import CopyText from "@/app/utility/Copy";
import SearchIcon from "@svg/Search";
import AddressVisibility from "@/app/components/admin/listings/AddressVisibility ";

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
}

const DeletedListings = ({ DeletedData }: DeletedListingsProps) => {
  const queryClient = useQueryClient();
  const methods = useForm<SearchFormValues>({ defaultValues: { keyword: "" } });
  const { register, handleSubmit } = methods;

  // 🔹 서버에서 받은 초기 페이지로 시작
  const [page, setPage] = useState(DeletedData?.currentPage ?? 1);
  const [keyword, setKeyword] = useState("");

  // 🔹 쿼리키
  const qk = useMemo(
    () => ["builds-deleted", page, LIMIT, (keyword ?? "").trim()],
    [page, keyword]
  );

  // 🔹 page=초기값 + keyword="" 일 때만 서버 프롭을 initialData로 사용 (하이드레이션)
  const shouldUseInitial =
    (DeletedData?.currentPage ?? 1) === page && (keyword ?? "") === "";

  const { data, isLoading, isError } = useQuery({
    queryKey: qk,
    queryFn: () => BuildFindAllDeleted(page, LIMIT, keyword),
    placeholderData: keepPreviousData,
    initialData: shouldUseInitial ? DeletedData : undefined,
    // 초기 하이드레이션 즉시 재요청을 막고 싶으면(선택):
    staleTime: 10_000,
  });

  // 🔹 rows 안정화 (deps = data?.data)
  const rows = useMemo<IBuild[]>(
    () => (Array.isArray(data?.data) ? (data!.data as IBuild[]) : []),
    [data]
  );

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
      {/* 상단 바 (서버 컴포넌트에서 <Selected /> 이미 렌더됨) */}
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
        <div className="text-sm text-slate-600">삭제된 매물 목록</div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-slate-600 text-white">
              <th className="p-3 text-sm font-medium">#</th>
              <th className="p-3 text-sm font-medium">매물번호</th>
              <th className="p-3 text-sm font-medium">공개/거래</th>
              <th className="p-3 text-sm font-medium">거래종류</th>
              <th className="p-3 text-sm font-medium">매물종류</th>
              <th className="p-3 text-sm font-medium">주소</th>
              <th className="p-3 text-sm font-medium">매물정보</th>
              <th className="p-3 text-sm font-medium">금액</th>
              <th className="p-3 text-sm font-medium">조회수</th>
              <th className="p-3 text-sm font-medium">등록일<br />(수정일)</th>
              <th className="p-3 text-sm font-medium">삭제일</th>
              <th className="p-3 text-sm font-medium">비고</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((listing: IBuild, index: number) => {
              const id = Number(listing.id);
              return (
                <tr
                  key={id}
                  className={clsx(
                    "hover:bg-slate-300 transition-colors duration-300",
                    index % 2 === 0 ? "bg-slate-100" : "bg-slate-200",
                  )}
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{id}</td>

                  <td className="p-3">
                    <AddressVisibility
                      activeAddressPublic={listing.isAddressPublic as "public" | "private" | "exclude"}
                      listingId={id}
                      serverSync={false}     // 🔹 서버 호출 금지 (삭제 목록이므로)
                      disabled               // 🔹 UI 비활성화
                      handleRadioChange={() => { /* 삭제 목록에서는 수정 불가 */ }}
                    />

                    <div className="mt-1 text-xs text-slate-500">(수정 불가)</div>

                    <ToggleSwitch
                      toggle={!!listing.visibility}
                      id={`visibility-${id}`}
                      onToggle={() => {}}
                      // 🔹 ToggleSwitch에 disabled prop이 없으면 아래 클래스로 비활성화
                      className="pointer-events-none opacity-50 cursor-not-allowed"
                    />
                  </td>

                  <td className="p-3">{listing.dealType}</td>
                  <td className="p-3">{listing.propertyType}</td>
                  <td className="p-3"><CopyText text={listing.address ?? ""} /></td>

                  <td className="p-3">
                    <div>{listing.title}</div>
                    <div>방 {listing.rooms} / 화장실 {listing.bathrooms}</div>
                    <div>실면적 {listing.actualArea}평 / 공급면적 {listing.supplyArea}평</div>
                    <div>{listing.direction} / 지상 {listing.currentFloor}/{listing.totalFloors}층</div>
                  </td>

                  <td className="p-3">
                    {listing.salePrice && <div>분: {formatFullKoreanMoney(Number(listing.salePrice))}</div>}
                    {listing.rentalPrice && <div>전: {formatFullKoreanMoney(Number(listing.rentalPrice))}</div>}
                    {listing.actualEntryCost && <div>실: {formatFullKoreanMoney(Number(listing.actualEntryCost))}</div>}
                    {listing.managementFee && <div>관: {formatFullKoreanMoney(Number(listing.managementFee))}</div>}
                  </td>

                  <td className="p-3">{listing?.views ?? 0}</td>

                  <td className="p-3">
                    <div>{new Date(String(listing.createdAt)).toLocaleDateString()}</div>
                    <div>
                      {
                        listing.createdAt !== listing.updatedAt && <div>({new Date(String(listing.updatedAt)).toLocaleDateString()})</div>
                      }
                    </div>
                  </td>
                  <td className="p-3">
                    {listing?.deletedAt ? new Date(String(listing.deletedAt)).toLocaleDateString() : "-"}
                  </td>

                  {/* ✅ 여기 교체: 복원 / 영구 삭제 버튼 */}
                  <td className="p-3">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="my-4 flex justify-center">
          <Pagination
            currentPage={data?.currentPage ?? page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default DeletedListings;
