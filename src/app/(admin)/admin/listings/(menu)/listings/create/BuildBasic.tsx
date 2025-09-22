"use client"

import {clsx} from "clsx";
import React, { MouseEventHandler, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import { ko } from "date-fns/locale";

// 공통 Input 컴포넌트
type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
  isDatePicker?: boolean; // 📌 추가: DatePicker 사용 여부
};

const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  className = "",
  isDatePicker = false, // 기본 false
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
              {...field}
              id={name}
              selected={field.value}
              onChange={(date: Date | null) => field.onChange(date)}
              placeholderText={placeholder || "날짜 선택"}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              showYearDropdown
              showMonthDropdown
              scrollableYearDropdown
              className={clsx([
                "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                className,
              ])}
            />
          ) : (
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              className={clsx([
                "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                className,
              ])}
            />
          )
        }
      />
    </div>
  );
};
// 공통 Select 컴포넌트
const SelectField = ({ label, name, options, className = "mt-1 p-2 border" }:{
  label: string; name: string; options: string[]; className?: string;
}) => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            {...field}
            className={clsx(
              "mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500", // Tailwind styles for select element
              className // Allows additional styles to be passed
            )}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};


// 공통 Button 컴포넌트 (Updated with `isSelected` prop)
const Button = ({
  type,
  label,
  className = "p-2 border",
  isSelected = false, // isSelected prop
  onClick
}: {
  type: "button" | "submit";
  label: string;
  className?: string;
  isSelected?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>
}) => {
  const buttonStyle = getButtonStyle(isSelected);

  return (
    <button
      type={type}
      className={`${className} p-3 rounded`}
      style={buttonStyle} // 외부 스타일 적용
      onClick={onClick}
    >
      {label}
    </button>
  );
};


const getButtonStyle = (activeState: string | null | boolean, item?: string) => {
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

const BuildBasic = () => {
  const { watch, setValue, register } = useFormContext();
  const watchedPopularity = watch("popularity");
  const watchedDirection = watch("watchedDirection");
  const [activePropertyType, setActivePropertyType] = useState<string | null>(null);
  const [activedirection, setActivedirection] = useState<string | null>(null);
  const [activeDirectionBase, setActiveDirectionBase] = useState<string | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuildingOptions] = useState<string[]>([]);
  const [selectedParking, setSelectedParkingOptions] = useState<string[]>([]);

  // Handle button click (toggle selection)
  const handleThemesButtonClick = (event: string) => {
    setSelectedThemes((prev) =>
      prev.includes(event)
      ? prev.filter((item) => item !== event)  // Remove theme if already selected
      : [...prev, event]  // Add theme if not selected
    );
  };
  const handleBuildingOptionsButtonClick = (event: string) => {
    setSelectedBuildingOptions((prev) =>
      prev.includes(event)
        ? prev.filter((item) => item !== event)  // Remove buildingOptions if already selected
        : [...prev, event]  // Add buildingOptions if not selected
    );
  };
  const handleParkingButtonClick = (event: string) => {
    setSelectedParkingOptions((prev) =>
      prev.includes(event)
        ? prev.filter((item) => item !== event)  // Remove buildingOptions if already selected
        : [...prev, event]  // Add buildingOptions if not selected
    );
  };

  const handleRadioChange = (item: string, type: string) => {
    switch (type) {
      case "popularity":
        setActivePropertyType(item === activePropertyType ? null : item);
        setValue("popularity", item);  // react-hook-form 값 업데이트
        break;
      case "direction":
        setActivedirection(item === activedirection ? null : item);
        setValue("direction", item);  // react-hook-form 값 업데이트
        break;
      case "directionBase":
        setActiveDirectionBase(item === activeDirectionBase ? null : item);
        setValue("directionBase", item);  // react-hook-form 값 업데이트
        break;
      default:
        break;
    }
  };

  

  const onClickCustomer: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    console.log('hi', e);
  }

  useEffect(() => {
    // 상태가 변경될 때마다 setValue로 업데이트
    setValue("themes", selectedThemes); // selectedThemes 값 react-hook-form에 설정
    setValue("buildingOptions", selectedBuilding); // selectedBuildingOptions 값 react-hook-form에 설정
    setValue("parking", selectedParking); // selectedBuildingOptions 값 react-hook-form에 설정
    setValue("directionBase", activeDirectionBase); // selectedBuildingOptions 값 react-hook-form에 설정
  }, [selectedThemes, selectedBuilding, setValue, selectedParking, activeDirectionBase]);

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
                id={`propertyType-${item}`}
                {...register("popularity")}
                value={item}
                className="hidden"
                checked={watchedPopularity === item}  // 상태에 맞게 checked 처리
                onChange={() => handleRadioChange(item, "popularity")}
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
        <InputField label="실면적" name="actualArea" type="number" placeholder=" m2단위의 숫자만 입력하세요" />
        <InputField label="공급면적" name="supplyArea" type="number" placeholder=" m2단위의 숫자만 입력하세요" />
        <InputField label="대지면적" name="landArea" type="number" placeholder=" m2단위의 숫자만 입력하세요" />
        <InputField label="건축면적" name="buildingArea" type="number" placeholder=" m2단위의 숫자만 입력하세요" />
        <InputField label="연면적" name="totalArea" type="number" placeholder=" m2단위의 숫자만 입력하세요" />
      </div>

        {/* 테마 */}
        <div className="flex flex-col">
        <label>테마</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["반려동물", "저보증금 원룸", "전세자금대출", "복층", "주차가능", "옥탑", "역세권", "신축"].map((theme, idx) => (
            <label key={idx} className="cursor-pointer">
              <input
                type="checkbox"  // Changed from radio to checkbox for toggle behavior
                id={`theme-${theme}`}
                value={theme}
                className="hidden"
                {...register("themes")}
                checked={selectedThemes.includes(theme)}  // Check if the theme is selected
                onChange={() => handleThemesButtonClick(theme)}  // Toggle selection on click
              />
              <span
                style={getButtonStyle(
                  selectedThemes.includes(theme) ? theme : null, theme
                )}
              >
                {theme}
              </span>
            </label>
          ))}
        </div>
      </div>

       {/* 옵션 */}
       <div className="flex flex-col">
        <label>옵션</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["에어컨", "세탁기", "침대", "책상", "옷장", "TV", "신발장", "냉장고", "가스레인지", "오븐", "인덕션", "전자레인지", "식탁", "싱크대", "비데", "엘리베이터", "도어락", "CCTV", "무인택배함", "인터폰"].map((theme, idx) => (
            <label key={idx} className="cursor-pointer">
              <input
                type="checkbox"  // Changed from radio to checkbox for toggle behavior
                id={`option-${theme}`}
                value={theme}
                className="hidden"
                checked={selectedBuilding.includes(theme)}  // Check if the option is selected
                {...register("buildingOptions")}
                onChange={() => handleBuildingOptionsButtonClick(theme)}  // Toggle selection on click
              />
              <span
                style={getButtonStyle(
                  selectedBuilding.includes(theme) ? theme : null, theme
                )}
              >
                {theme}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 건축정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="착공일자" name="constructionYear" isDatePicker />
        <InputField label="허가일자" name="permitDate" isDatePicker />
        <InputField label="사용승인일자" name="approvalDate" isDatePicker />
      </div>

      {/* 주차 */}
      <div className="grid grid-cols-3 gap-4">
        <InputField label="세대당 주차수" name="parkingPerUnit" type="number" />
        <InputField label="전체주차수" name="totalParking" type="number" />
        <InputField label="주차비" name="parkingFee" type="number" />
      </div>

      {/* 주차옵션 */}
      <div className="flex flex-col">
        <label>주차옵션</label>
        <div className="flex space-x-2 mt-2 flex-wrap gap-y-4">
          {["주차가능", "주차불가", "주차협의", "자주식주차", "기계식주차"].map((theme, idx) => (
            <label key={idx} className="cursor-pointer">
              <input
                type="checkbox"  // Changed from radio to checkbox for toggle behavior
                id={`parkingOption-${theme}`}
                value={theme}
                className="hidden"
                {...register("parking")}
                checked={selectedParking.includes(theme)}  // Check if the parking option is selected
                onChange={() => handleParkingButtonClick(theme)}  // Toggle selection on click
              />
              <span
                style={getButtonStyle(
                  selectedParking.includes(theme) ? theme : null, theme
                )}
              >
                {theme}
              </span>
            </label>
          ))}
        </div>
      </div>


      {/* 방향 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
          방향
        </label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
          {["동향", "서향", "남향", "북향", "북동향", "남동향", "남서향", "북서향"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                {...register("direction")}
                value={item}
                className="hidden"
                checked={watchedDirection === item}  // 상태에 맞게 checked 처리
                onChange={() => handleRadioChange(item, "direction")}
              />
              <span
                style={getButtonStyle(activedirection, item)}  // 동적 스타일 적용
              >
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 방향기준 */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">
        방향기준
        </label>
        <div className="flex space-x-0 mt-2 flex-wrap gap-y-4">
          {["거실", "안방", "주된출입구"].map((item) => (
            <label key={item} className="cursor-pointer">
              <input
                type="radio"
                {...register("directionBase")}
                value={item}
                className="hidden"
                checked={watchedDirection === item}  // 상태에 맞게 checked 처리
                onChange={() => handleRadioChange(item, "directionBase")}
              />
              <span
                style={getButtonStyle(activeDirectionBase, item)}  // 동적 스타일 적용
              >
                {item}
              </span>
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
        <SelectField
          label="담당자"
          name="staff"
          options={["권오길", "다른사람A", "다른사람B"]}
        />
        <SelectField
          label="고객 종류"
          name="customerType"
          options={["매도자", "매수자", "임대인"]}
        />
        <InputField label="고객 이름" name="customerName" />
      </div>

        {/* 버튼 */}
        <div className="flex space-x-4">
          <Button type="submit" label="고객 등록" className="bg-blue-500 text-white p-3 rounded" onClick={onClickCustomer} />
          <Button type="button" label="고객 관리" className="bg-gray-500 text-white p-3 rounded" onClick={onClickCustomer} />
          <Button type="button" label="담당자 관리" className="bg-gray-500 text-white p-3 rounded" onClick={onClickCustomer} />
        </div>
      </div>
  );
};

export default BuildBasic;