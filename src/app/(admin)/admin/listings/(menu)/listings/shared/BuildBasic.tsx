"use client";

import React, { lazy, MouseEventHandler, Suspense } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ko } from "date-fns/locale";
import { clsx } from "clsx";
import "react-datepicker/dist/react-datepicker.css";

const DatePicker = lazy(() => import('react-datepicker'));

/* =========================
   공통 스타일/컴포넌트
   ========================= */
const getButtonStyle = (activeState: string | null | boolean, item?: string) => {
  return {
    backgroundColor: activeState === item ? "#2b6cb0" : "white",
    color: activeState === item ? "white" : "gray",
    borderColor: "#cbd5e0",
    padding: "0.4rem 0.8rem",
    fontSize: "0.75rem",
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

/* ---------- 유틸 함수 ---------- */
// Date -> "YYYY-MM-DD"
const dateToDateOnlyString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// value (string | Date | null | undefined) -> Date | null (로컬 자정으로 생성)
const parseValueToDate = (val: any): Date | null => {
  if (!val) return null;

  if (typeof val === 'string') {
    const datePart = val.split('T')[0];
    const [year, month, day] = datePart.split('-').map(Number);
    if (year && month && day) {
      return new Date(year, month - 1, day);
    }
  }

  if (val instanceof Date) {
    return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  }

  // Fallback for other types or failed parsing
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
  } catch {}

  return null;
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
            <Suspense>
            <DatePicker
              id={name}
              selected={parseValueToDate(field.value)}
              onChange={(date: Date | null) => {
                if (date) {
                  // 사용자 선택한 로컬 날짜를 "YYYY-MM-DD" 형식 문자열로 저장
                  const only = dateToDateOnlyString(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
                  field.onChange(only);
                } else {
                  field.onChange(null);
                }
              }}
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
            </Suspense>
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
              value={field.value ?? ""}
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
                "mt-1 block w-full p-2 sm:p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                className
              )}
          >
            {(options || []).map((op) => (
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
interface BuildBasicProps {
  roomOptions: string[];
  bathroomOptions: string[];
  themeOptions: string[];
  labelOptions: string[];
  buildingOptions: { id: number; name: string }[];
}

const BuildBasic = ({ roomOptions, bathroomOptions, themeOptions, labelOptions, buildingOptions }: BuildBasicProps) => {
  const { watch, setValue, register, getValues } = useFormContext();

  // ✅ 폼 값 watch (오타 수정 및 값 보정)
  const watchedPopularity = watch("popularity") ?? "";
  const watchedDirection = watch("direction") ?? "";
  const watchedDirectionBase = watch("directionBase") ?? "";
  const watchedRooms = watch("rooms") ?? "";
  const watchedBathrooms = watch("bathrooms") ?? "";
  const watchedThemes = watch("themes") ?? [];
  const watchedBuildingOptions = watch("buildingOptions") ?? [];
  const watchedParking = watch("parking") ?? [];

  // ✅ 라디오(단일 선택) → 폼 값 갱신
  const handleRadioChange = (
    item: string,
    type: "popularity" | "direction" | "directionBase" | "rooms" | "bathrooms"
  ) => {
    setValue(type, item, { shouldDirty: true, shouldTouch: true });
  };

  // ✅ 체크박스(다중 선택) → 폼/로컬 동시 갱신
  const handleBuildingOptionsButtonClick = (v: number) => {
    const current = getValues("buildingOptions") ?? [];
    const next = current.includes(v)
      ? current.filter((x: number) => x !== v)
      : [...current, v];
    setValue("buildingOptions", next, { shouldDirty: true, shouldTouch: true });
  };
  const handleParkingButtonClick = (v: string) => {
    const current = getValues("parking") ?? [];
    const next = current.includes(v)
      ? current.filter((x: string) => x !== v)
      : [...current, v];
    setValue("parking", next, { shouldDirty: true, shouldTouch: true });
  };

  const handleThemesButtonClick = (v: string) => {
    const current = getValues("themes") ?? [];
    const next = current.includes(v)
      ? current.filter((x: string) => x !== v)
      : [...current, v];
    setValue("themes", next, { shouldDirty: true, shouldTouch: true });
  };

  const onClickCustomer: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    // TODO: 모달/페이지 이동 등
  };

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 bg-slate-100">
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
                onChange={() => handleRadioChange(item, "popularity")}
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
          options={labelOptions}
        />
      </div>

      {/* 층수 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="층수" name="floorType" options={["지상", "지하", "반지하", "옥탑"]} />
        <InputField label="현재층" name="currentFloor" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="전체층" name="totalFloors" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="지하층" name="basementFloors" type="number" placeholder="숫자만 입력하세요" />
        <InputField label="층수 설명" name="floorDescription" placeholder="" />
      </div>

      {/* 방수/화장실수 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">방수</label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {(roomOptions || []).map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  {...register("rooms")}
                  value={item}
                  className="hidden"
                  checked={watchedRooms === item}
                  onChange={() => handleRadioChange(item, "rooms")}
                />
                <span style={getButtonStyle(watchedRooms, item)}>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-700">화장실수</label>
          <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
            {(bathroomOptions || []).map((item) => (
              <label key={item} className="cursor-pointer">
                <input
                  type="radio"
                  {...register("bathrooms")}
                  value={item}
                  className="hidden"
                  checked={watchedBathrooms === item}
                  onChange={() => handleRadioChange(item, "bathrooms")}
                />
                <span style={getButtonStyle(watchedBathrooms, item)}>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 면적 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          {(themeOptions || []).map(
            (theme) => {
              const checked = watchedThemes.includes(theme);
              return (
                <label key={theme} className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checked}
                    onChange={() => handleThemesButtonClick(theme)}
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
          {(buildingOptions || []).map((opt) => {
            const checked = watchedBuildingOptions.includes(opt.id);
            return (
              <label key={opt.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => handleBuildingOptionsButtonClick(opt.id)}
                />
                <span style={getButtonStyle(checked ? opt.name : null, opt.name)}>
                  {opt.name}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="세대당 주차수" name="parkingPerUnit" type="number" />
        <InputField label="전체주차수" name="totalParking" type="number" />
        <InputField label="주차비" name="parkingFee" type="number" />
      </div>

      {/* 주차옵션 */}
      <div className="flex flex-col">
        <label>주차옵션</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["주차가능", "주차불가", "주차협의", "자주식주차", "기계식주차"].map((opt) => {
            const checked = watchedParking.includes(opt);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="용도지역" name="landUse" options={["상업지구", "주거지구"]} />
        <SelectField label="지목" name="landType" options={["대지", "전"]} />
        <InputField label="건축물용도" name="buildingUse" />
      </div>

      {/* 담당자 및 고객 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField label="담당자" name="staff" options={["권오길", "다른사람A", "다른사람B"]} />
        <SelectField label="고객 종류" name="customerType" options={["매도자", "매수자", "임대인"]} />
        <InputField label="고객 이름" name="customerName" />
      </div>

      {/* 버튼 */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <Button type="submit" label="고객 등록" className="bg-blue-500 text-white w-full sm:w-auto" onClick={onClickCustomer} />
        <Button type="button" label="고객 관리" className="bg-gray-500 text-white w-full sm:w-auto" onClick={onClickCustomer} />
        <Button type="button" label="담당자 관리" className="bg-gray-500 text-white w-full sm:w-auto" onClick={onClickCustomer} />
      </div>
    </div>
  );
};

export default BuildBasic;
