/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { clsx } from "clsx";

/* =========================
   공통 스타일/컴포넌트
   ========================= */
const getButtonStyle = (activeState: string | null | boolean, item?: string) => {
  return {
    backgroundColor: activeState === item ? "#2b6cb0" : "white",
    color: activeState === item ? "white" : "gray",
    borderColor: "#cbd5e0",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "0.375rem",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
  } as React.CSSProperties;
};

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  isDatePicker?: boolean;
};
const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  className = "",
  isDatePicker = false,
}: InputFieldProps) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <Controller
        control={control}
        name={name}
        render={({ field }) =>
          isDatePicker ? (
            <DatePicker
              id={name}
              /* 폼 값이 string | Date | null 이어도 안전하게 선택값 계산 */
              selected={
                field.value instanceof Date
                  ? field.value
                  : field.value
                  ? new Date(field.value)
                  : null
              }
              onChange={(date: Date | null) => field.onChange(date)}
              placeholderText={placeholder || "날짜 선택"}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              className={clsx(
                "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                className
              )}
            />
          ) : (
            <input
              id={name}
              type={type}
              placeholder={placeholder}
              className={clsx(
                "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                className
              )}
              {...field}
            />
          )
        }
      />
    </div>
  );
};

const SelectField = ({
  label,
  name,
  options,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            {...field}
            className={clsx(
              "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
              className
            )}
          >
            {options.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

const Button = ({
  type,
  label,
  className = "p-2 border",
  isSelected = false,
  onClick,
}: {
  type: "button" | "submit";
  label: string;
  className?: string;
  isSelected?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const buttonStyle = getButtonStyle(isSelected);
  return (
    <button
      type={type}
      className={clsx(className, "p-3 rounded")}
      style={buttonStyle}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

/* =========================
   BuildBasic 본문
   ========================= */
const BuildBasic = () => {
  const { watch, setValue, register } = useFormContext();

  // ✅ 폼 값 watch (오타 수정 및 값 보정)
  const watchedPopularity = watch("popularity") ?? "";
  const watchedDirection = watch("direction") ?? "";
  const watchedDirectionBase = watch("directionBase") ?? "";

  const watchedThemes = watch("themes") ?? [];
  const watchedBuildingOptions = watch("buildingOptions") ?? [];
  const watchedParking = watch("parking") ?? [];

  // ✅ 체크박스 UI용 로컬 상태 (폼 값과 항상 동기화)
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuildingOptions] = useState<string[]>([]);
  const [selectedParking, setSelectedParkingOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedThemes(Array.isArray(watchedThemes) ? watchedThemes : []);
  }, [watchedThemes]);

  useEffect(() => {
    setSelectedBuildingOptions(
      Array.isArray(watchedBuildingOptions) ? watchedBuildingOptions : []
    );
  }, [watchedBuildingOptions]);

  useEffect(() => {
    setSelectedParkingOptions(
      Array.isArray(watchedParking) ? watchedParking : []
    );
  }, [watchedParking]);

  // ✅ 라디오(단일 선택) → 폼 값 갱신
  const handleRadioChange = (
    item: string,
    type: "popularity" | "direction" | "directionBase"
  ) => {
    setValue(type, item, { shouldDirty: true, shouldTouch: true });
  };

  // ✅ 체크박스(다중 선택) → 폼/로컬 동시 갱신
  const handleThemesButtonClick = (v: string) => {
    setSelectedThemes((prev) => {
      const next = prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      setValue("themes", next, { shouldDirty: true, shouldTouch: true });
      return next;
    });
  };
  const handleBuildingOptionsButtonClick = (v: string) => {
    setSelectedBuildingOptions((prev) => {
      const next = prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      setValue("buildingOptions", next, { shouldDirty: true, shouldTouch: true });
      return next;
    });
  };
  const handleParkingButtonClick = (v: string) => {
    setSelectedParkingOptions((prev) => {
      const next = prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      setValue("parking", next, { shouldDirty: true, shouldTouch: true });
      return next;
    });
  };

  const onClickCustomer: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // TODO: 모달/페이지 이동 등
  };

  return (
    <div className="p-4 space-y-6 bg-slate-100">
      {/* 인기/급매 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          인기/급매
        </label>
        <div className="flex space-x-0 mt-2">
          {["인기", "급매"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                {...register("popularity")}
                value={item}
                className="hidden"
                checked={watchedPopularity === item}
                // onChange={() => handleRadioChange(item, "popularity")}
              />
              <span style={getButtonStyle(watchedPopularity, item)}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 라벨선택 */}
      <div className="flex flex-col">
        <SelectField
          label="라벨선택"
          name="label"
          options={["저보증금", "전세자금", "반려동물", "신축", "풀옵션", "인증매물", "신혼부부"]}
        />
      </div>

      {/* 층수 */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="층수" name="floorType" options={["지상", "지하", "반지하", "옥탑"]} />
        <InputField label="현재층" name="currentFloor" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="전체층" name="totalFloors" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="지하층" name="basementFloors" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="층수 설명" name="floorDescription" placeholder="" />
      </div>

      {/* 방수/화장실수 */}
      <div className="grid grid-cols-2 gap-4">
        <InputField label="방수" name="rooms" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="화장실수" name="bathrooms" type="number" placeholder="숫자만 입력하세요" />
      </div>

      {/* 면적 */}
      <div className="grid grid-cols-2 gap-4">
        <InputField label="실면적" name="actualArea" type="number" placeholder="m² 단위 숫자" />
        <InputField label="공급면적" name="supplyArea" type="number" placeholder="m² 단위 숫자" />
        <InputField label="대지면적" name="landArea" type="number" placeholder="m² 단위 숫자" />
        <InputField label="건축면적" name="buildingArea" type="number" placeholder="m² 단위 숫자" />
        <InputField label="연면적" name="totalArea" type="number" placeholder="m² 단위 숫자" />
      </div>

      {/* 테마 */}
      <div className="flex flex-col">
        <label>테마</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["반려동물", "저보증금 원룸", "전세자금대출", "복층", "주차가능", "옥탑", "역세권", "신축"].map(
            (theme) => {
              const checked = selectedThemes.includes(theme);
              return (
                <label key={theme} className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    // onChange={() => handleThemesButtonClick(theme)}
                    onChange={() => {
                      setSelectedThemes(prev => {
                        const next = prev.includes(theme) ? prev.filter(x => x !== theme) : [...prev, theme];
                        setValue("themes", next, { shouldDirty: true, shouldTouch: true }); // ✅ 이벤트 핸들러에서만 호출
                        return next;
                      });
                    }}
                  />
                  <span style={getButtonStyle(checked ? theme : null, theme)}>
                    {theme}
                  </span>
                </label>
              );
            }
          )}
        </div>
      </div>

      {/* 옵션 */}
      <div className="flex flex-col">
        <label>옵션</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {[
            "에어컨", "세탁기", "침대", "책상", "옷장", "TV", "신발장", "냉장고",
            "가스레인지", "오븐", "인덕션", "전자레인지", "식탁", "싱크대",
            "비데", "엘리베이터", "도어락", "CCTV", "무인택배함", "인터폰",
          ].map((opt) => {
            const checked = selectedBuilding.includes(opt);
            return (
              <label key={opt} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => handleBuildingOptionsButtonClick(opt)}
                />
                <span style={getButtonStyle(checked ? opt : null, opt)}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 건축정보(캘린더) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="착공일자" name="constructionYear" isDatePicker />
        <InputField label="허가일자" name="permitDate" isDatePicker />
        <InputField label="사용승인일자" name="approvalDate" isDatePicker />
      </div>

      {/* 주차 숫자 */}
      <div className="grid grid-cols-3 gap-4">
        <InputField label="세대당 주차수" name="parkingPerUnit" type="number" />
        <InputField label="전체주차수" name="totalParking" type="number" />
        <InputField label="주차비" name="parkingFee" type="number" />
      </div>

      {/* 주차옵션 */}
      <div className="flex flex-col">
        <label>주차옵션</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["주차가능", "주차불가", "주차협의", "자주식주차", "기계식주차"].map((opt) => {
            const checked = selectedParking.includes(opt);
            return (
              <label key={opt} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => handleParkingButtonClick(opt)}
                />
                <span style={getButtonStyle(checked ? opt : null, opt)}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 방향 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">방향</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
          {["동향", "서향", "남향", "북향", "북동향", "남동향", "남서향", "북서향"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                {...register("direction")}
                value={item}
                className="hidden"
                checked={watchedDirection === item}
                onChange={() => handleRadioChange(item, "direction")}
              />
              <span style={getButtonStyle(watchedDirection, item)}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 방향기준 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">방향기준</label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
          {["거실", "안방", "주된출입구"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                {...register("directionBase")}
                value={item}
                className="hidden"
                checked={watchedDirectionBase === item}
                onChange={() => handleRadioChange(item, "directionBase")}
              />
              <span style={getButtonStyle(watchedDirectionBase, item)}>{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 토지건축물정보 */}
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="용도지역" name="landUse" options={["상업지구", "주거지구"]} />
        <SelectField label="지목" name="landType" options={["대지", "전"]} />
        <InputField label="건축물용도" name="buildingUse" />
      </div>

      {/* 담당자 및 고객 */}
      <div>
        <SelectField label="담당자" name="staff" options={["권오길", "다른사람A", "다른사람B"]} />
        <SelectField label="고객 종류" name="customerType" options={["매도자", "매수자", "임대인"]} />
        <InputField label="고객 이름" name="customerName" />
      </div>

      {/* 버튼 */}
      <div className="flex space-x-4">
        <Button type="submit" label="고객 등록" className="bg-blue-500 text-white" onClick={onClickCustomer} />
        <Button type="button" label="고객 관리" className="bg-gray-500 text-white" onClick={onClickCustomer} />
        <Button type="button" label="담당자 관리" className="bg-gray-500 text-white" onClick={onClickCustomer} />
      </div>
    </div>
  );
};

export default BuildBasic;
