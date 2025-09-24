"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import AddressVisibility from "@/app/components/admin/listings/AddressVisibility "

const LocationCard = () => {
  const { register, formState: { errors } } = useFormContext(); // useFormContext로 폼 상태 접근
  const [activeAddressPublic, setActiveAddressPublic] = useState<string>("public");

  // 초기 상태로 '공개' 라디오 버튼을 선택된 상태로 설정
  useEffect(() => {
    setActiveAddressPublic("public");
  }, []);

  const handleRadioChange = (item: string) => {
    setActiveAddressPublic(item === activeAddressPublic ? "public" : item);
  };

  return (
    <div className="p-4 space-y-6 bg-slate-100">
      {/* 주소 */}
      <div className="flex flex-col">
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          주소
        </label>
        <input
          type="text"
          id="address"
          {...register("address", { required: "주소를 입력해주세요" })}
          placeholder="상세주소 입력하세요"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.address && <p className="text-red-500 text-xs">주소를 입력해주세요</p>}
      </div>

      {/* 동/호 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="dong" className="block text-sm font-medium text-gray-700">
            동
          </label>
          <input
            type="text"
            id="dong"
            {...register("dong")}
            placeholder="동"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="ho" className="block text-sm font-medium text-gray-700">
            호
          </label>
          <input
            type="text"
            id="ho"
            {...register("ho")}
            placeholder="호수"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          {...register("etc")}
          placeholder="기타사항"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 주소 공개 여부 */}
      <AddressVisibility 
        activeAddressPublic={activeAddressPublic}
        handleRadioChange={handleRadioChange}
        serverSync={false}
        ArrayType={false}
      />


      {/* 지도 위치 */}
      <div className="flex flex-col">
        <label htmlFor="mapLocation" className="block text-sm font-medium text-gray-700">
          지도 위치 (Google Maps URL)
        </label>
        <input
          type="url"
          id="mapLocation"
          {...register("mapLocation", { required: "지도 URL을 입력해주세요" })}
          placeholder="https://maps.google.com/..."
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default LocationCard;
