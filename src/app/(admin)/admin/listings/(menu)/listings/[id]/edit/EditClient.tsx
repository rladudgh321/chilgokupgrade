"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import BuildForm, { BASE_DEFAULTS, FormData } from "@/app/(admin)/admin/listings/(menu)/listings/shared/BuildForm";
import { BuildFindOne, BuildUpdate } from "@/app/apis/build";

interface Option {
  id: number;
  name: string;
}

const fetchRoomOptions = async (): Promise<Option[]> => {
  const res = await fetch("/api/room-options", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch room options");
  const json = await res.json();
  return json.data;
};

const fetchBathroomOptions = async (): Promise<Option[]> => {
  const res = await fetch("/api/bathroom-options", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch bathroom options");
  const json = await res.json();
  return json.data;
};

const fetchThemeOptions = async () => {
  const res = await fetch("/api/theme-images", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch theme options");
  const json = await res.json();
  return json.data.map((item: { label: string }) => item.label);
};

function toStrArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) {
    return v
      .map((x) => (typeof x === "string" ? x : (x as any)?.url ?? ""))
      .filter((s) => typeof s === "string" && s.trim().length > 0);
  }
  if (typeof v === "string") return v.trim() ? [v.trim()] : [];
  if (typeof v === "object" && v) {
    const url = (v as any).url;
    return typeof url === "string" && url.trim() ? [url.trim()] : [];
  }
  return [];
}

function normalizeForForm(d: any, roomOptions: Option[], bathroomOptions: Option[], themeOptions: string[]): FormData {
  return {
    ...BASE_DEFAULTS,

    // 문자열
    address: d.address ?? "",
    dong: d.dong ?? "",
    ho: d.ho ?? "",
    etc: d.etc ?? "",
    mapLocation: d.mapLocation ?? "",
    propertyType: d.propertyType ?? "",
    dealType: d.dealType ?? "",
    dealScope: d.dealScope ?? "",
    priceDisplay: d.priceDisplay ?? "",
    popularity: d.popularity ?? "",
    label: d.label ?? "저보증금",
    floorType: d.floorType ?? "지상",
    floorDescription: d.floorDescription ?? "",
    direction: d.direction ?? "",
    directionBase: d.directionBase ?? "",
    landUse: d.landUse ?? "상업지구",
    landType: d.landType ?? "대지",
    buildingUse: d.buildingUse ?? "",
    staff: d.staff ?? "권오길",
    customerType: d.customerType ?? "매도자",
    customerName: d.customerName ?? "",

    elevatorType: d.elevatorType ?? "",
    moveInType: d.moveInType ?? "",
    heatingType: d.heatingType ?? "",
    yieldType: d.yieldType ?? "",
    otherYield: d.otherYield ?? "",
    buildingName: d.buildingName ?? "",
    floorAreaRatio: d.floorAreaRatio ?? "",
    otherUse: d.otherUse ?? "",
    mainStructure: d.mainStructure ?? "",
    height: d.height ?? "",
    roofStructure: d.roofStructure ?? "",

    title: d.title ?? "",
    editorContent: d.editorContent ?? "",
    secretNote: d.secretNote ?? "",
    secretContact: d.secretContact ?? "",

    mainImage:
      typeof d.mainImage === "string" && d.mainImage.trim()
        ? d.mainImage.trim()
        : (typeof d.mainImage === "object" && d.mainImage?.url ? d.mainImage.url : ""),

    subImage: toStrArray(d.subImage),
    adminImage: toStrArray(d.adminImage),

    // enum/boolean/number/array/date
    isAddressPublic: d.isAddressPublic ?? "public",
    visibility: d.visibility ?? true, // ← 스키마가 boolean이면 boolean 유지

    salePrice: d.salePrice ?? 0,
    actualEntryCost: d.actualEntryCost ?? 0,
    rentalPrice: d.rentalPrice ?? 0,
    managementFee: d.managementFee ?? 0,
    managementEtc: d.managementEtc ?? d.management_etc ?? "",
    
    currentFloor: d.currentFloor ?? 0,
    totalFloors: d.totalFloors ?? 0,
    basementFloors: d.basementFloors ?? 0,
    rooms: d.roomOption?.name ?? (roomOptions.length > 0 ? roomOptions[0].name : ""),
    bathrooms: d.bathroomOption?.name ?? (bathroomOptions.length > 0 ? bathroomOptions[0].name : ""),
    actualArea: d.actualArea ?? 0,
    supplyArea: d.supplyArea ?? 0,
    landArea: d.landArea ?? 0,
    buildingArea: d.buildingArea ?? 0,
    totalArea: d.totalArea ?? 0,
    parkingPerUnit: d.parkingPerUnit ?? 0,
    totalParking: d.totalParking ?? 0,
    parkingFee: d.parkingFee ?? 0,
    elevatorCount: d.elevatorCount ?? 0,

    themes: (d.themes && d.themes[0]) ?? (themeOptions.length > 0 ? themeOptions[0] : ""),
    buildingOptions: Array.isArray(d.buildingOptions) ? d.buildingOptions : [],
    parking: Array.isArray(d.parking) ? d.parking : [],

    // 날짜 필드는 input[type=date]와 호환되는 'YYYY-MM-DD' 문자열 권장
    constructionYear: d.constructionYear ? d.constructionYear.slice(0,10) : "",
    permitDate: d.permitDate ? d.permitDate.slice(0,10) : "",
    approvalDate: d.approvalDate ? d.approvalDate.slice(0,10) : "",
    moveInDate: d.moveInDate ? d.moveInDate.slice(0,10) : "",
    contractEndDate: d.contractEndDate ? d.contractEndDate.slice(0,10) : "",
  };
}

export default function EditClient({ id }: { id: number }) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["build", id],
    queryFn: () => BuildFindOne(id),
  });

  const { data: roomOptions = [], isLoading: isLoadingRoomOptions } = useQuery<Option[]>({
    queryKey: ["roomOptions"],
    queryFn: fetchRoomOptions,
  });

  const { data: bathroomOptions = [], isLoading: isLoadingBathroomOptions } = useQuery<Option[]>({
    queryKey: ["bathroomOptions"],
    queryFn: fetchBathroomOptions,
  });

  const { data: themeOptions = [], isLoading: isLoadingThemeOptions } = useQuery({
    queryKey: ["themeOptions"],
    queryFn: fetchThemeOptions,
  });

  const methods = useForm<FormData>({ defaultValues: BASE_DEFAULTS });

  const allQueriesLoaded = !isLoading && !isLoadingRoomOptions && !isLoadingBathroomOptions && !isLoadingThemeOptions;

  // ✅ 데이터 도착 시 단 한번, 정규화해서 reset
  useEffect(() => {
    if (allQueriesLoaded && data) {
      methods.reset(normalizeForForm(data, roomOptions, bathroomOptions, themeOptions));
    }
  }, [allQueriesLoaded, data, roomOptions, bathroomOptions, themeOptions, methods]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FormData) => {
      const { rooms, bathrooms, themes, ...rest } = payload;

      const roomOption = roomOptions.find(opt => opt.name === rooms);
      const bathroomOption = bathroomOptions.find(opt => opt.name === bathrooms);

      const serverPayload: Record<string, unknown> = {
        ...rest,
        roomOptionId: roomOption?.id,
        bathroomOptionId: bathroomOption?.id,
        themes: themes ? [themes] : [],
      };
      
      return BuildUpdate(id, serverPayload);
    },
    onSuccess: () => router.back(),
    onError: (e) => {
      console.error(e);
      alert("수정 중 에러가 발생했습니다.");
    },
  });

  if (!allQueriesLoaded) return <p>로딩 중...</p>;
  if (isError) return <p>불러오기 실패</p>;

  return (
    <BuildForm
      mode="update"
      methods={methods}
      isSubmitting={isPending}
      onSubmit={(form) => mutate(form)}
      onCancel={() => router.back()}
      submitLabel="수정"
    />
  );
}
