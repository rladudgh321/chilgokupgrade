"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form"; // Controller를 사용합니다.
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';

const BuildingInfo = () => {
  const { register, setValue, control } = useFormContext(); // control을 추가하여 Controller 사용
  const [activeElevatorType, setActiveElevatorType] = useState<string | null>(null);
  const [activeHeatingType, setActiveHeatingType] = useState<string | null>(null);
  const [activeYieldType, setActiveYieldType] = useState<string | null>(null);
  const [activeMoveInType, setActiveMoveInType] = useState<string | null>(null);
  const [otherYield, setOtherYield] = useState<string>("");

  const handleRadioChange = (item: string, type: string) => {
    switch (type) {
      case "elevatorType":
        setActiveElevatorType(item === activeElevatorType ? null : item);
        setValue("elevatorType", item);
        break;
      case "heatingType":
        setActiveHeatingType(item === activeHeatingType ? null : item);
        setValue("heatingType", item);
        break;
      case "yieldType":
        setActiveYieldType(item === activeYieldType ? null : item);
        setValue("yieldType", item);
        break;
      case "moveInType":
        setActiveMoveInType(item === activeMoveInType ? null : item);
        setValue("moveInType", item);
        break;
      default:
        break;
    }
  };

  const handleOtherYieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherYield(e.target.value);
    setValue("otherYield", e.target.value);
  };

  // 동적 버튼 스타일링 함수
  const getButtonStyle = (activeState: string | null, item: string) => {
    return {
      backgroundColor: activeState === item ? "#2b6cb0" : "white",  // 선택된 항목의 배경색
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
        backgroundColor: "#3182ce",  // hover 상태에서의 배경색
        color: "white",  // hover 상태에서의 텍스트 색상
      },
      ":focus": {
        outline: "none",  // focus 시 테두리 제거
        boxShadow: "0 0 0 2px #63b3ed",  // focus 시 경계선
      },
    };
  };

  return (
      <div className="px-4 space-y-6 bg-slate-100">
        {/* 엘리베이터 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            엘리베이터
          </label>
          <div className="flex space-x-0 mt-2">
            {["유", "무"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`elevatorType-${item}`}
                  {...register("elevatorType")}
                  value={item}
                  className="hidden"
                  checked={activeElevatorType === item}
                  onChange={() => handleRadioChange(item, "elevatorType")}
                />
                <span
                  style={getButtonStyle(activeElevatorType, item)}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
          {/* 엘리베이터 갯수 */}
          {activeElevatorType === "유" && (
            <div className="mt-2">
              <label htmlFor="elevatorCount" className="block text-sm font-medium text-gray-700">
                엘리베이터 갯수
              </label>
              <input
                type="number"
                id="elevatorCount"
                {...register("elevatorCount")}
                placeholder="갯수 입력"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* 입주 가능일 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            입주 가능일
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["즉시", "가까운 시일내 협의"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`moveInType-${item}`}
                  {...register("moveInType")}
                  value={item}
                  className="hidden"
                  checked={activeMoveInType === item}
                  onChange={() => handleRadioChange(item, "moveInType")}
                />
                <span
                  style={getButtonStyle(activeMoveInType, item)}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
          {/* 입주 가능일 선택 */}
          {activeMoveInType === "가까운 시일내 협의" && (
            <Controller
              control={control} // control을 사용하여 form 상태 관리
              name="moveInDate" // 필드 이름
              render={({ field }) => (
                <DatePicker
                  {...field} // react-hook-form 필드와 연결
                  selected={field.value} // 선택된 날짜
                  onChange={(date: Date | null) => field.onChange(date)} // 날짜 선택 시 필드 업데이트
                  dateFormat="yyyy/MM/dd"
                  placeholderText="입주 가능일 선택"
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  locale={ko}  // 한국어 로케일 설정
                />
              )}
            />
          )}
        </div>

        {/* 난방 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            난방
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["지역난방", "개별난방", "중앙난방"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`heatingType-${item}`}
                  {...register("heatingType")}
                  value={item}
                  className="hidden"
                  checked={activeHeatingType === item}
                  onChange={() => handleRadioChange(item, "heatingType")}
                />
                <span
                  style={getButtonStyle(activeHeatingType, item)}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 수익률 사용 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            수익률 사용
          </label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {["미사용", "상가수익률", "건물수익률", "기타수익률"].map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  id={`yieldType-${item}`}
                  {...register("yieldType")}
                  value={item}
                  className="hidden"
                  checked={activeYieldType === item}
                  onChange={() => handleRadioChange(item, "yieldType")}
                />
                <span
                  style={getButtonStyle(activeYieldType, item)}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
          {/* 기타수익률 입력 */}
          {activeYieldType === "기타수익률" && (
            <input
              type="text"
              {...register("otherYield")}  // react-hook-form의 register를 사용하여 상태를 관리
              value={otherYield}
              onChange={handleOtherYieldChange}
              className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="기타수익률 입력"
            />
          )}
        </div>

        {/* 계약만료일 */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">
            계약만료일
          </label>
          <Controller
            control={control} // control을 사용하여 form 상태 관리
            name="contractEndDate" // 필드 이름
            render={({ field }) => (
              <DatePicker
                {...field} // react-hook-form 필드와 연결
                selected={field.value} // 선택된 날짜
                onChange={(date: Date | null) => field.onChange(date)} // 날짜 선택 시 필드 업데이트 (null 처리)
                dateFormat="yyyy/MM/dd"
                placeholderText="계약만료일 선택"
                className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                locale={ko}  // 한국어 로케일 설정
              />
            )}
          />
        </div>

        {/* 건물명 */}
        <div className="flex flex-col">
          <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
            건물명
          </label>
          <input
            type="text"
            id="buildingName"
            {...register("buildingName")}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="건물명"
          />
        </div>

        {/* 기타 항목들 */}
        {[ 
          { id: "floorAreaRatio", label: "용적률 산정 면적" }, 
          { id: "otherUse", label: "기타용도" }, 
          { id: "mainStructure", label: "주구조" },
          { id: "height", label: "높이" },
          { id: "roofStructure", label: "지붕구조" },
        ].map((field) => (
          <div key={field.id} className="flex flex-col">
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="text"
              id={field.id}
              {...register(field.id)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={field.label}
            />
          </div>
        ))}
      </div>
  );
};

export default BuildingInfo;
