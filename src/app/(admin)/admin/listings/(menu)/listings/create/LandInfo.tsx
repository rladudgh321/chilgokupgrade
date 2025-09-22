"use client"

import { useState } from "react";
import { useFormContext } from "react-hook-form";

const LandInfo = () => {
  const { register, setValue, watch } = useFormContext(); // useFormContext로 폼 상태 접근
  const [activePropertyType, setActivePropertyType] = useState<string | null>(null);
  const [activeDealType, setActiveDealType] = useState<string | null>(null);
  const [activeDealScope, setActiveDealScope] = useState<string | null>(null);
  const [activeVisibility, setActiveVisibility] = useState<string | null>(null);
  const [activePriceDisplay, setActivePriceDisplay] = useState<string | null>(null);

  const handleRadioChange = (item: string, type: string) => {
    switch (type) {
      case "propertyType":
        setActivePropertyType(item === activePropertyType ? null : item);
        setValue("propertyType", item);  // react-hook-form 값 업데이트
        break;
      case "dealType":
        setActiveDealType(item === activeDealType ? null : item);
        setValue("dealType", item);  // react-hook-form 값 업데이트
        break;
      case "dealScope":
        setActiveDealScope(item === activeDealScope ? null : item);
        setValue("dealScope", item);  // react-hook-form 값 업데이트
        break;
      case "visibility":
        setActiveVisibility(item === activeVisibility ? null : item);
        setValue("visibility", item);  // react-hook-form 값 업데이트
        break;
      case "priceDisplay":
        setActivePriceDisplay(item === activePriceDisplay ? null : item);
        setValue("priceDisplay", item);  // react-hook-form 값 업데이트
        break;
      default:
        break;
    }
  };

  const getButtonStyle = (activeState: string | null, item: string) => {
    return {
      backgroundColor: activeState === item ? "#2b6cb0" : "white",  // 선택된 항목의 색상 (blue-600)
      color: activeState === item ? "white" : "gray",  // 선택된 항목의 텍스트 색상
      borderColor: "#cbd5e0",  // 기본 경계 색상
      padding: "0.5rem 1rem",  // padding
      fontSize: "0.875rem",  // 폰트 크기
      fontWeight: "500",  // 폰트 굵기
      borderRadius: "0.375rem",  // 경계 radius
      cursor: "pointer",  // 마우스 커서
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",  // 그림자
      transition: "all 0.2s ease",  // 부드러운 전환
      ":hover": {
        backgroundColor: "#3182ce",  // hover 상태에서의 배경색 (blue-500)
        color: "white",  // hover 상태에서의 텍스트 색상
      },
      ":focus": {
        outline: "none",  // focus 시 테두리 제거
        boxShadow: "0 0 0 2px #63b3ed",  // focus 시 경계선
      }
    };
  };

  // 사용자가 선택한 값을 watch로 추적
  const watchedPropertyType = watch("propertyType");
  const watchedDealType = watch("dealType");
  const watchedDealScope = watch("dealScope");
  const watchedVisibility = watch("visibility");
  const watchedPriceDisplay = watch("priceDisplay");

  return (

      <div className="p-4 space-y-6 bg-slate-100">
        {/* 매물 종류 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            매물종류
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["아파트", "신축빌라", "원룸", "투룸", "쓰리룸", "사무실", "상가", "오피스텔"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`propertyType-${item}`}
                  {...register("propertyType")}
                  value={item}
                  className="hidden"
                  checked={watchedPropertyType === item}  // 상태에 맞게 checked 처리
                  onChange={() => handleRadioChange(item, "propertyType")}
                />
                <span
                  style={getButtonStyle(activePropertyType, item)}  // 동적 스타일 적용
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 거래 유형 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            거래유형
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["분양", "매매", "전세", "월세", "전월세"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`dealType-${item}`}
                  {...register("dealType")}
                  value={item}
                  className="hidden"
                  checked={watchedDealType === item}  // 상태에 맞게 checked 처리
                  onChange={() => handleRadioChange(item, "dealType")}
                />
                <span
                  style={getButtonStyle(activeDealType, item)}  // 동적 스타일 적용
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 거래 범위 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            거래범위
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["부분", "전체"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`dealScope-${item}`}
                  {...register("dealScope")}
                  value={item}
                  className="hidden"
                  checked={watchedDealScope === item}  // 상태에 맞게 checked 처리
                  onChange={() => handleRadioChange(item, "dealScope")}
                />
                <span
                  style={getButtonStyle(activeDealScope, item)}  // 동적 스타일 적용
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 분양가 */}
          <div className="flex flex-col">
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
              분양가
            </label>
            <input
              type="number"
              id="salePrice"
              {...register("salePrice")}
              placeholder="숫자로만 입력하세요"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 실입주금 */}
          <div className="flex flex-col">
            <label htmlFor="actualEntryCost" className="block text-sm font-medium text-gray-700">
              실입주금
            </label>
            <input
              type="number"
              id="actualEntryCost"
              {...register("actualEntryCost")}
              placeholder="숫자로만 입력하세요"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 전세가 */}
          <div className="flex flex-col">
            <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700">
              전세가
            </label>
            <input
              type="number"
              id="rentalPrice"
              {...register("rentalPrice")}
              placeholder="숫자로만 입력하세요"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 관리비 */}
          <div className="flex flex-col">
            <label htmlFor="managementFee" className="block text-sm font-medium text-gray-700">
              관리비
            </label>
            <input
              type="number"
              id="managementFee"
              {...register("managementFee")}
              placeholder="숫자로만 입력하세요"
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>


       {/* 공개여부 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            공개여부
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {[{ label: "공개", value: "true" }, { label: "비공개", value: "false" }].map(({ label, value }) => (
              <label key={label} className="cursor-pointer">
                <input
                  type="radio"
                  id={`visibility-${label}`}
                  {...register("visibility", {
                    setValueAs: (val) => val === "true"
                  })}
                  value={value}
                  className="hidden"
                  checked={watchedVisibility === value}
                  onChange={() => handleRadioChange(value, "visibility")}
                />
                <span
                  style={getButtonStyle(activeVisibility, value)}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 금액 표기 방법 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            금액 표기 방법
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["공개", "비공개", "협의가능"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`priceDisplay-${item}`}
                  {...register("priceDisplay")}
                  value={item}
                  className="hidden"
                  checked={watchedPriceDisplay === item}  // 상태에 맞게 checked 처리
                  onChange={() => handleRadioChange(item, "priceDisplay")}
                />
                <span
                  style={getButtonStyle(activePriceDisplay, item)}  // 동적 스타일 적용
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 기타사항 */}
        <div className="flex flex-col">
          <label htmlFor="etc" className="block text-sm font-medium text-gray-700">
            기타사항
          </label>
          <input
            type="text"
            id="etc"
            {...register("managementEtc")}
            placeholder="기타사항"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
  );
};

export default LandInfo;
