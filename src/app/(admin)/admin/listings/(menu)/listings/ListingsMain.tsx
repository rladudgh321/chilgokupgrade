"use client"

import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { keepPreviousData, useMutationState, useQuery } from "@tanstack/react-query";
import Pagination from "@/app/components/shared/Pagination";
import ToggleSwitch from "@/app/components/admin/listings/ToggleSwitch";
import { BuildFindAll, updateAddressVisibility, UpdateBuildToggle } from "@/app/apis/build";
import { clsx } from "clsx";
import { IBuild } from "@/app/interface/build";
import formatFullKoreanMoney from "@/app/utility/NumberToKoreanMoney";
import CopyText from "@/app/utility/Copy";
import { useDeleteBuild } from "@/app/hooks/useDeleteBuild";
import SearchIcon from '@svg/Search';
import AddressVisibility from "@/app/components/admin/listings/AddressVisibility ";

type SearchFormValues = {
  keyword: string;
};

// 가짜 데이터
const mockData = {
  totalPages: 3,
  data: [
    {
      id: 101,
      isAddressPublic: "public",
      visibility: true,
      dealType: "매매",
      propertyType: "아파트",
      address: "서울특별시 강남구 테헤란로 123",
      title: "강남 아파트 급매",
      rooms: 3,
      bathrooms: 2,
      actualArea: 25,
      supplyArea: 32,
      direction: "남향",
      currentFloor: 10,
      totalFloors: 20,
      salePrice: "850000000",
      rentalPrice: null,
      views: 123,
      actualEntryCost: "200000000",
      managementFee: "150000",
      createdAt: "2025-09-01T12:00:00Z",
      updatedAt: "2025-09-12T15:00:00Z",
      // confirmDate?: "2025-09-16" // 서버가 준다면 이렇게 들어올 수 있음
    },
    {
      id: 102,
      isAddressPublic: "private",
      visibility: false,
      dealType: "전세",
      propertyType: "오피스텔",
      address: "서울특별시 마포구 합정동 45-12",
      title: "합정역 도보 3분 오피스텔",
      rooms: 2,
      bathrooms: 1,
      actualArea: 18,
      supplyArea: 22,
      direction: "동향",
      currentFloor: 7,
      totalFloors: 15,
      salePrice: null,
      rentalPrice: "350000000",
      views: 512,
      actualEntryCost: null,
      managementFee: "120000",
      createdAt: "2025-08-20T12:00:00Z",
      updatedAt: "2025-09-10T15:00:00Z",
    },
  ],
}

function formatYYYYMMDD(d: Date) {
  // 한국시간 기준 YYYY-MM-DD로 포맷
  const tzDate = new Date(d.getTime() + (new Date().getTimezoneOffset() * -60000)); // 로컬 보정
  const year = tzDate.getFullYear();
  const month = String(tzDate.getMonth() + 1).padStart(2, "0");
  const day = String(tzDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const ListingsMain = () => {
    useEffect(async () => {
    const gg = await BuildFindAll(1,1);
        console.log('gg', gg)
    },[])

  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ 검색 상태

  const methods = useForm<SearchFormValues>({
    defaultValues: { keyword: "" },
  });
  const { register, handleSubmit } = methods;

  const deleteMutation = useDeleteBuild();

  // 실제 API 대신 mock 사용 (현재 개발용)
  const { data, isLoading, isError } = {
    data: mockData,
    isLoading: false,
    isError: false,
  };

  // 확인일 상태: { [id]: "YYYY-MM-DD" | undefined }
  const [confirmDates, setConfirmDates] = useState<Record<number, string | undefined>>({});
  // 드롭다운 오픈 중인 행 id
  const [menuRowId, setMenuRowId] = useState<number | null>(null);

  // 데이터 로드 시 초기 확인일 주입 (서버가 주면 사용)
  useEffect(() => {
    const init: Record<number, string | undefined> = {};
    data?.data?.forEach((item: any) => {
      // 서버에서 confirmDate 내려오면 반영
      if (item.confirmDate) init[item.id] = item.confirmDate;
    });
    setConfirmDates((prev) => ({ ...init, ...prev }));
  }, [data]);

  const handleDelete = (id: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      deleteMutation.mutate(id);
    }
  };

  const variables = useMutationState({
    filters: { mutationKey: ["patchAddressVisibility"], status: "pending" },
    select: (mutation) => mutation.state.variables as "public" | "private" | "exclude",
  });

  const onSubmit = handleSubmit((formData) => {
    setSearchKeyword(formData.keyword);
    setPage(1);
  });

  const today = useMemo(() => formatYYYYMMDD(new Date()), []);

  // 확인일 추가 (없을 때 버튼)
  const addConfirmDate = (id: number) => {
    setConfirmDates((prev) => ({ ...prev, [id]: today }));
    // TODO: 서버 저장 호출 필요 시 여기서 API 호출
  };

  // 확인일 갱신(오늘), 삭제, 수정
  const updateConfirmDateToToday = (id: number) => {
    setConfirmDates((prev) => ({ ...prev, [id]: today }));
    setMenuRowId(null);
    // TODO: 서버 저장 호출
  };

  const deleteConfirmDate = (id: number) => {
    setConfirmDates((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setMenuRowId(null);
    // TODO: 서버 저장 호출
  };

  const editConfirmDate = (id: number) => {
    const input = window.prompt("2026-01-01 형식으로 작성해주세요");
    if (!input) return;
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(input);
    if (!valid) {
      alert("형식이 올바르지 않습니다. 예: 2026-01-01");
      return;
    }
    const dt = new Date(input);
    // 날짜 유효성 추가 확인 (예: 2026-02-30 같은 잘못된 날짜 방지)
    if (Number.isNaN(dt.getTime()) || formatYYYYMMDD(dt) !== input) {
      alert("존재하지 않는 날짜입니다. 예: 2026-01-01");
      return;
    }
    setConfirmDates((prev) => ({ ...prev, [id]: input }));
    setMenuRowId(null);
    // TODO: 서버 저장 호출
  };

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

  return (
    <FormProvider {...methods}>
      <div className="mb-4 max-w-md">
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

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-center">
          <thead>
            <tr className="bg-slate-600 text-white">
              <th className="p-3 text-sm font-medium">선택</th>
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
            {data?.data?.map((listing: IBuild, index: number) => {
              const confirmDate = confirmDates[listing.id!];
              return (
                <tr
                  key={listing.id}
                  className={clsx(
                    "hover:bg-slate-300 transition-colors duration-300",
                    index % 2 === 0 ? "bg-slate-100" : "bg-slate-200",
                  )}
                >
                  <td className="p-3 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3">{listing.id}</td>
                  <td className="p-3">
                    {/* 주소 공개 여부 */}
                    <AddressVisibility
                      activeAddressPublic={listing.isAddressPublic!}
                      handleRadioChange={(newState: "public" | "private" | "exclude") => {
                        updateAddressVisibility(listing.id!, { isAddressPublic: newState })
                          .catch(() => alert("주소 공개여부 변경 실패"));
                      }}
                    />

                    <div>매물공개여부</div>
                    <ToggleSwitch
                      toggle={listing.visibility}
                      id={`visibility-${listing.id}`}
                      onToggle={(checked) => {
                        UpdateBuildToggle(listing.id!, { visibility: checked })
                          .catch(() => alert("매물 공개여부 변경 실패"));
                      }}
                    />
                  </td>
                  <td className="p-3">{listing.dealType}</td>
                  <td className="p-3">{listing.propertyType}</td>
                  <td className="p-3"><CopyText text={listing.address!} /></td>
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
                  <td className="p-3">{listing.views}</td>
                  <td className="p-3">
                    {new Date(String(listing.createdAt)).toLocaleDateString()}
                    <br />
                    {new Date(String(listing.createdAt)).toLocaleDateString() !== new Date(String(listing.updatedAt)).toLocaleDateString() &&
                      `(수정 ${new Date(String(listing.updatedAt)).toLocaleDateString()})`
                    }
                    {confirmDate && <div className="mt-1">(확인일 {confirmDate})</div>}
                  </td>
                  <td className="p-3 relative">
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                      <button className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200">
                        프린트
                      </button>

                      {/* 확인일 버튼 / 드롭다운 */}
                      {!confirmDate ? (
                        <button
                          onClick={() => addConfirmDate(listing.id!)}
                          className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200"
                        >
                          확인일 추가
                        </button>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setMenuRowId((prev) => (prev === listing.id ? null : listing.id!))}
                            className="text-sm text-white bg-blue-500 px-3 py-1 rounded-lg shadow hover:bg-blue-400 transition duration-200"
                          >
                            확인일 갱신
                          </button>

                          {menuRowId === listing.id && (
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-10 w-36 bg-white border border-slate-200 rounded-lg shadow-lg text-sm">
                              <button
                                onClick={() => updateConfirmDateToToday(listing.id!)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                              >
                                확인일 갱신(오늘)
                              </button>
                              <button
                                onClick={() => editConfirmDate(listing.id!)}
                                className="w-full text-left px-3 py-2 hover:bg-slate-100"
                              >
                                확인일 수정
                              </button>
                              <button
                                onClick={() => deleteConfirmDate(listing.id!)}
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
                      <button className="text-sm text-white bg-green-500 px-3 py-1 rounded-lg shadow hover:bg-green-400 transition duration-200">수정</button>
                      <button
                        onClick={() => handleDelete(listing.id!)}
                        className="text-sm text-white bg-red-500 px-3 py-1 rounded-lg shadow hover:bg-red-400 transition duration-200"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 페이지네이션 항상 표시 */}
        <div className="my-4 flex justify-center">
          <Pagination totalPages={data.totalPages} currentPage={page} onPageChange={setPage} />
        </div>
      </div>
    </FormProvider>
  );
};

export default ListingsMain;
