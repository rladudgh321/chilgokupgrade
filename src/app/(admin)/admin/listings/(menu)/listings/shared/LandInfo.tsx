/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";

const LandInfo = () => {
  const { register, setValue, control } = useFormContext<{
    propertyType: string;
    dealType: string;
    dealScope: string;
    visibility: boolean;        // ✅ 불린
    priceDisplay: string;
    salePrice: number;
    actualEntryCost: number;
    rentalPrice: number;
    managementFee: number;
    managementEtc: string;
  }>();

  // ✅ RHF 값 구독 (reset로 내려온 서버 데이터가 바로 들어옴)
  const propertyType  = useWatch({ control, name: "propertyType" })  ?? "";
  const dealType      = useWatch({ control, name: "dealType" })      ?? "";
  const dealScope     = useWatch({ control, name: "dealScope" })     ?? "";
  const visibility    = useWatch({ control, name: "visibility" })    ?? true;   // 불린
  const priceDisplay  = useWatch({ control, name: "priceDisplay" })  ?? "";

  const onPick = <K extends keyof any>(field: K, value: any) => {
    setValue(field as any, value, { shouldDirty: true, shouldTouch: true });
  };

  const isActive = (curr: string | boolean, item: string | boolean) => curr === item;

  const chip = (active: boolean) =>
    ({
      backgroundColor: active ? "#2b6cb0" : "white",
      color:          active ? "white"    : "gray",
      borderColor: "#cbd5e0",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: 500,
      borderRadius: "0.375rem",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      transition: "all .2s ease",
    } as React.CSSProperties);

  // 매물종류 옵션 동적 로드
  const [propertyTypeOptions, setPropertyTypeOptions] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/property-types");
        const json = await res.json();
        if (!cancelled && json?.ok && Array.isArray(json.data)) {
          const names = (json.data as Array<{ name?: string }>)
            .map((r) => r?.name)
            .filter((v): v is string => typeof v === 'string' && v.length > 0);
          const uniq = Array.from(new Set<string>(names));
          setPropertyTypeOptions(uniq);
        }
      } catch {
        // ignore; keep defaults empty
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-4 space-y-6 bg-slate-100">
      {/* 매물종류 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">매물종류</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4 gap-x-2">
          {(propertyTypeOptions.length > 0 ? propertyTypeOptions : ["아파트","신축빌라","원룸","투룸","쓰리룸","사무실","상가","오피스텔"]).map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                {...register("propertyType")}
                value={item}
                checked={propertyType === item}
                onChange={() => onPick("propertyType", item)}
              />
              <span style={chip(isActive(propertyType, item))}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 거래유형 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">거래유형</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4 gap-x-2">
          {["분양","매매","전세","월세","전월세"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                {...register("dealType")}
                value={item}
                checked={dealType === item}
                onChange={() => onPick("dealType", item)}
              />
              <span style={chip(isActive(dealType, item))}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 거래범위 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">거래범위</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4 gap-x-2">
          {["부분","전체"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                {...register("dealScope")}
                value={item}
                checked={dealScope === item}
                onChange={() => onPick("dealScope", item)}
              />
              <span style={chip(isActive(dealScope, item))}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 숫자 입력들: 숫자로 보정 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">분양가</label>
          <input
            id="salePrice"
            type="number"
            {...register("salePrice", { setValueAs: v => v === "" ? 0 : Number(v) })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="숫자로만 입력"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="actualEntryCost" className="block text-sm font-medium text-gray-700">실입주금</label>
          <input
            id="actualEntryCost"
            type="number"
            {...register("actualEntryCost", { setValueAs: v => v === "" ? 0 : Number(v) })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="숫자로만 입력"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="rentalPrice" className="block text-sm font-medium text-gray-700">전세가</label>
          <input
            id="rentalPrice"
            type="number"
            {...register("rentalPrice", { setValueAs: v => v === "" ? 0 : Number(v) })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="숫자로만 입력"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="managementFee" className="block text-sm font-medium text-gray-700">관리비</label>
          <input
            id="managementFee"
            type="number"
            {...register("managementFee", { setValueAs: v => v === "" ? 0 : Number(v) })}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="숫자로만 입력"
          />
        </div>
      </div>

      {/* 공개여부 (불린) */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">공개여부</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4 gap-x-2">
          {[{ label: "공개", value: true }, { label: "비공개", value: false }].map(({ label, value }) => (
            <label key={label} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                // register는 submit/validation용, 실사용은 setValue
                {...register("visibility")}
                value={String(value)}
                checked={visibility === value}
                onChange={() => onPick("visibility", value)}   // ✅ 불린으로 저장
              />
              <span style={chip(isActive(visibility, value))}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 금액 표기 방법 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">금액 표기 방법</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4 gap-x-2">
          {["공개","비공개","협의가능"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                {...register("priceDisplay")}
                value={item}
                checked={priceDisplay === item}
                onChange={() => onPick("priceDisplay", item)}
              />
              <span style={chip(isActive(priceDisplay, item))}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 기타사항 */}
      <div className="flex flex-col">
        <label htmlFor="managementEtc" className="block text-sm font-medium text-gray-700">기타사항</label>
        <input
          id="managementEtc"
          type="text"
          {...register("managementEtc")}
          placeholder="기타사항"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LandInfo;
