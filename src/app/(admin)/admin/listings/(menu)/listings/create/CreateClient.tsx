"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import LocationCard from "./LocationCard";  // LocationCard를 import 해줍니다.
import LandInfo from "./LandInfo";
import BuildingInfo from "./BuildingInfo";
import BuildBasic from "./BuildBasic";
import { useRouter } from "next/navigation";
import Editor from "./Editor";
import SaveImage from "./SaveImage";
import Container from "./Container";
import { BuildCreate } from "@/app/apis/build";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  // LocationCard
  address: string;
  dong: string;
  ho: string;
  etc: string;
  isAddressPublic: "public" | "private" | "exclude";
  mapLocation: string;

  // LandInfo
  propertyType: string; //매물종류
  dealType: string; //거래유형
  dealScope: string; //거래범위
  visibility: string; //공개여부
  priceDisplay: string; //금액 표기 방법
  salePrice: number; //분양가
  actualEntryCost: number; //실입주금
  rentalPrice: number; //전세가
  managementFee: number; //관리비
  managementEtc: string; //기타사항

  // BuildBasic
  popularity: string;
  label: string;
  floorType: string;
  currentFloor: number;
  totalFloors: number;
  basementFloors: number;
  floorDescription: string;
  rooms: number;
  bathrooms: number;
  actualArea: number;
  supplyArea: number;
  landArea: number;
  buildingArea: number;
  totalArea: number;
  themes: string[];
  buildingOptions: string[];
  constructionYear: number;
  permitDate: number;
  approvalDate: number;
  parkingPerUnit: number;
  totalParking: number;
  parkingFee: number;
  parking: string[];
  direction: string;
  directionBase: string;
  landUse: string;
  landType: string;
  buildingUse: string;
  staff: string;
  customerType: string;
  customerName: string;

  // BuildInfo
  elevatorType: string;
  elevatorCount?: number;
  moveInType: string;
  moveInDate: string | Date;
  heatingType: string;
  yieldType: string;
  otherYield: string;
  contractEndDate: string | Date;
  buildingName: string;
  floorAreaRatio: string;
  otherUse: string;
  mainStructure: string;
  height: string;
  roofStructure: string;

  // DetailDescription
  title: string;
  editorContent: string;
  secretNote: string;
  secretContact: string;

  // SaveImage
  mainImage: string;
  subImage: string;
  adminImage: string;
}

const CreateClient = () => {
  const router = useRouter();
  const methods = useForm<FormData>({
    defaultValues: {
      address: "",
      dong: "",
      ho: "",
      etc: "",
      isAddressPublic: "public",  // 기본값을 공개로 설정
      mapLocation: "",

      propertyType: "",
      dealType: "",
      dealScope: "",
      visibility: "",
      priceDisplay: "",
      managementEtc: "",
      
      // BuildBasic
      popularity: "",
      label: "저보증금",
      floorType: "지상",
      currentFloor: 0,
      totalFloors: 0,
      basementFloors: 0,
      floorDescription: "",
      rooms: 0,
      bathrooms: 0,
      actualArea: 0,
      supplyArea: 0,
      landArea: 0,
      buildingArea: 0,
      totalArea: 0,
      themes: [],
      buildingOptions: [],
      constructionYear: 0,
      permitDate: 0,
      approvalDate: 0,
      parkingPerUnit: 0,
      totalParking: 0,
      parkingFee: 0,
      parking: [],
      direction: "",
      directionBase: "",
      landUse: "상업지구",
      landType: "대지",
      buildingUse: "",
      staff: "권오길",
      customerType: "매도자",
      customerName: "",

      elevatorType: "",
      elevatorCount: 0,
      moveInType: "",
      heatingType: "",
      yieldType: "",
      otherYield: "",
      contractEndDate: "",
      buildingName: "",
      floorAreaRatio :"",
      otherUse :"",
      mainStructure: "",
      height: "",
      roofStructure: "",

      title: "",
      editorContent: "",
      secretNote: "",
      secretContact: "",

      mainImage: "",
      subImage: "",
      adminImage: "",
    }});

  const { mutate, isPending } = useMutation({
    mutationFn: BuildCreate,
    onSuccess: () => {
      router.back(); // 성공 시 뒤로 가기
    },
    onError: (error) => {
      console.error("등록 에러", error);
      alert("등록 중 에러가 발생했습니다.");
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    console.log('result', data);
    mutate(data); // form 데이터를 mutate에 전달
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <Container title="위치정보">
          <LocationCard />
        </Container>
        <Container title="매물정보">
          <LandInfo />
        </Container>
        <Container title="기본정보">
          <BuildBasic />
        </Container>
        <Container title="건물 추가 정보">
          <BuildingInfo />
        </Container>
        <Container title="상세 설명">
          <Editor />
        </Container>
        <Container title="사진 작업">
          <SaveImage />
        </Container>
        <div className="mt-4 flex gap-x-4">
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2 rounded-md transition duration-300 ${
              isPending ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isPending ? "등록 중..." : "등록"}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            뒤로가기
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateClient;
