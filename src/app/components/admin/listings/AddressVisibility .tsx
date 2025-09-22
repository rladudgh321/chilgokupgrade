"use client";

import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateAddressVisibility } from "@/app/apis/build";
import { clsx } from "clsx";

type AddressState = "public" | "private" | "exclude";

interface AddressVisibilityProps {
  /** 현재 선택된 상태 */
  activeAddressPublic: AddressState;
  /** 부모 상태 변경 콜백 (UI 즉시 반영) */
  handleRadioChange: (item: AddressState) => void;

  /** 서버로 동기화할지 여부 (기본: true). create 단계에서는 false 로 전달 */
  serverSync?: boolean;

  /** 서버 동기화 시 사용할 listing id */
  listingId?: number;

  ArrayType?: boolean; 
}

const AddressVisibility: FC<AddressVisibilityProps> = ({
  activeAddressPublic,
  handleRadioChange,
  serverSync = true,
  listingId,
  ArrayType = true
}) => {
  // 서버 동기화 뮤테이션 (항상 선언, 호출은 조건부)
  const { mutate, isPending } = useMutation({
    mutationKey: ["patchAddressVisibility", listingId],
    mutationFn: (vars: { id: number; state: AddressState }) =>
      updateAddressVisibility(vars.id, { isAddressPublic: vars.state }),
    onSuccess: () => {
      // 성공 알림(원치 않으면 제거하세요)
      alert("주소 공개여부가 성공적으로 변경되었습니다.");
    },
    onError: (error) => {
      alert(`주소 공개여부 변경 실패: ${error}`);
    },
  });

  const onPick = (state: AddressState) => {
    // 1) 즉시 UI 반영
    handleRadioChange(state);

    // 2) 서버 동기화 조건부 호출
    if (serverSync) {
      if (listingId == null) {
        // 개발 중 실수 방지용
        console.warn("[AddressVisibility] serverSync=true인데 listingId가 없습니다.");
        return;
      }
      mutate({ id: listingId, state });
    }
  };

  const getRadioButtonStyle = (activeState: string, item: string) => ({
    backgroundColor: activeState === item ? "#2b6cb0" : "white",
    color: activeState === item ? "white" : "gray",
    borderColor: "#cbd5e0",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "0.375rem",
    cursor: "pointer",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s ease",
    opacity: isPending ? 0.7 : 1, // 서버 처리 중 살짝 비활성화 느낌
  });

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700">주소 공개 여부</label>

      <div className={clsx("flex items-center mb-4 flex-wrap gap-2", { "justify-center": ArrayType})}>
        <label htmlFor="addressPublicYes" className="flex items-center space-x-2">
          <input
            type="radio"
            id="addressPublicYes"
            value="public"
            className="hidden"
            checked={activeAddressPublic === "public"}
            onChange={() => onPick("public")}
          />
          <span style={getRadioButtonStyle(activeAddressPublic, "public")}>공개</span>
        </label>

        <label htmlFor="addressPublicNo" className="flex items-center space-x-2">
          <input
            type="radio"
            id="addressPublicNo"
            value="private"
            className="hidden"
            checked={activeAddressPublic === "private"}
            onChange={() => onPick("private")}
          />
          <span style={getRadioButtonStyle(activeAddressPublic, "private")}>비공개</span>
        </label>

        <label htmlFor="addressPublicExclude" className="flex items-center space-x-2">
          <input
            type="radio"
            id="addressPublicExclude"
            value="exclude"
            className="hidden"
            checked={activeAddressPublic === "exclude"}
            onChange={() => onPick("exclude")}
          />
          <span style={getRadioButtonStyle(activeAddressPublic, "exclude")}>지번 제외 공개</span>
        </label>
      </div>
    </div>
  );
};

export default AddressVisibility;
