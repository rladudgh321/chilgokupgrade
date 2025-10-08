// app/components/admin/listings/BuildForm.tsx
"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import Container from "./Container";
import LocationCard from "./LocationCard";
import LandInfo from "./LandInfo";
import BuildBasic from "./BuildBasic";
import BuildingInfo from "./BuildingInfo";
import Editor from "./Editor";
import SaveImage from "./SaveImage";

export type AddressState = "public" | "private" | "exclude";

export interface FormData {
  // LocationCard
  address: string;
  dong: string;
  ho: string;
  etc: string;
  isAddressPublic: AddressState;
  mapLocation: string;

  // LandInfo
  propertyType: string;
  dealType: string;
  dealScope: string;
  visibility: boolean;
  priceDisplay: string;
  salePrice: number;
  isSalePriceEnabled: boolean;
  lumpSumPrice: number;
  isLumpSumPriceEnabled: boolean;
  actualEntryCost: number;
  isActualEntryCostEnabled: boolean;
  rentalPrice: number;
  isRentalPriceEnabled: boolean;
  halfLumpSumMonthlyRent: number;
  isHalfLumpSumMonthlyRentEnabled: boolean;
  deposit: number;
  isDepositEnabled: boolean;
  managementFee: number;
  isManagementFeeEnabled: boolean;
  managementEtc: string;

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

  // BuildingInfo
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
  subImage: string[];
  adminImage: string[];
}

export const BASE_DEFAULTS: FormData = {
  address: "",
  dong: "",
  ho: "",
  etc: "",
  isAddressPublic: "public",
  mapLocation: "",

  propertyType: "",
  dealType: "",
  dealScope: "",
  visibility: "",
  priceDisplay: "",
  salePrice: 0,
  isSalePriceEnabled: false,
  lumpSumPrice: 0,
  isLumpSumPriceEnabled: false,
  actualEntryCost: 0,
  isActualEntryCostEnabled: false,
  rentalPrice: 0,
  isRentalPriceEnabled: false,
  halfLumpSumMonthlyRent: 0,
  isHalfLumpSumMonthlyRentEnabled: false,
  deposit: 0,
  isDepositEnabled: false,
  managementFee: 0,
  isManagementFeeEnabled: false,
  managementEtc: "",

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
  moveInDate: "",
  heatingType: "",
  yieldType: "",
  otherYield: "",
  contractEndDate: "",
  buildingName: "",
  floorAreaRatio: "",
  otherUse: "",
  mainStructure: "",
  height: "",
  roofStructure: "",

  title: "",
  editorContent: "",
  secretNote: "",
  secretContact: "",

  mainImage: "",
  subImage: [],
  adminImage: [],
};

type Props = {
  methods: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  mode: "create" | "update";
  submitLabel?: string;
  onCancel?: () => void;
  roomOptions: string[];
  bathroomOptions: string[];
  themeOptions: string[];
};

export default function BuildForm({
  methods,
  onSubmit,
  isSubmitting,
  mode,
  submitLabel,
  onCancel,
  roomOptions,
  bathroomOptions,
  themeOptions,
}: Props) {
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
          <BuildBasic roomOptions={roomOptions} bathroomOptions={bathroomOptions} themeOptions={themeOptions} />
        </Container>

        <Container title="건물 추가 정보">
          <BuildingInfo />
        </Container>

        <Container title="상세 설명">
          <Editor name="editorContent" />
        </Container>

        <Container title="사진 작업">
          <SaveImage />
        </Container>

        <div className="mt-4 flex gap-x-4">
          <button
            type="submit"
            disabled={!!isSubmitting}
            className={`w-full py-2 rounded-md transition duration-300 ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSubmitting ? (mode === "create" ? "등록 중..." : "수정 중...") : submitLabel ?? (mode === "create" ? "등록" : "수정")}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            뒤로가기
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
