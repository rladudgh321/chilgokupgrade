"use client";

import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateAddressVisibility } from "@/app/apis/build";
import { clsx } from "clsx";

type AddressState = "public" | "private" | "exclude";

interface AddressVisibilityProps {
  activeAddressPublic: AddressState;
  handleRadioChange: (item: AddressState) => void;
  serverSync?: boolean;
  listingId?: number;
  ArrayType?: boolean;
  /** 🔹 삭제 목록 등에서 비활성화 */
  disabled?: boolean;
}

const AddressVisibility: FC<AddressVisibilityProps> = ({
  activeAddressPublic,
  handleRadioChange,
  serverSync = true,
  listingId,
  ArrayType = true,
  disabled = false,
}) => {
  // 행마다 고유 그룹/아이디
  const uid = String(listingId ?? Math.random().toString(36).slice(2));
  const group = `addr-public-${uid}`;
  const idPublic  = `${group}-public`;
  const idPrivate = `${group}-private`;
  const idExclude = `${group}-exclude`;

  type Ctx = { prev: AddressState };

  const { mutate, isPending } = useMutation<
    { message: string; id: number; isAddressPublic: AddressState },
    Error,
    { id: number; state: AddressState },
    Ctx
  >({
    mutationKey: ["patchAddressVisibility", listingId],
    mutationFn: (vars) =>
      updateAddressVisibility(vars.id, { isAddressPublic: vars.state }),
    onMutate: async (vars) => {
      const prev = activeAddressPublic;
      handleRadioChange(vars.state);   // 낙관적 반영
      return { prev };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prev) handleRadioChange(ctx.prev); // 롤백
      alert(`주소 공개여부 변경 실패: ${error.message ?? String(error)}`);
    },
  });

  const onPick = (state: AddressState) => {
    if (disabled) return;                     // 🔹 비활성화면 무시
    if (!serverSync) return handleRadioChange(state);
    if (listingId == null) {
      console.warn("[AddressVisibility] serverSync=true인데 listingId가 없습니다.");
      return;
    }
    mutate({ id: listingId, state });
  };

  const pillStyle = (active: string, me: string) => ({
    backgroundColor: active === me ? "#2b6cb0" : "white",
    color: active === me ? "white" : "gray",
    borderColor: "#cbd5e0",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    borderRadius: "0.375rem",
    cursor: disabled || isPending ? "not-allowed" : "pointer",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
    opacity: disabled || isPending ? 0.5 : 1,
  });

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700">주소 공개 여부</label>

      <div className={clsx("flex items-center mb-4 flex-wrap gap-2", { "justify-center": ArrayType })}>
        <label htmlFor={idPublic} className="flex items-center space-x-2">
          <input
            type="radio"
            id={idPublic}
            name={group}
            value="public"
            className="hidden"
            checked={activeAddressPublic === "public"}
            onChange={() => onPick("public")}
            disabled={disabled || isPending}
          />
          <span style={pillStyle(activeAddressPublic, "public")}>공개</span>
        </label>

        <label htmlFor={idPrivate} className="flex items-center space-x-2">
          <input
            type="radio"
            id={idPrivate}
            name={group}
            value="private"
            className="hidden"
            checked={activeAddressPublic === "private"}
            onChange={() => onPick("private")}
            disabled={disabled || isPending}
          />
          <span style={pillStyle(activeAddressPublic, "private")}>비공개</span>
        </label>

        <label htmlFor={idExclude} className="flex items-center space-x-2">
          <input
            type="radio"
            id={idExclude}
            name={group}
            value="exclude"
            className="hidden"
            checked={activeAddressPublic === "exclude"}
            onChange={() => onPick("exclude")}
            disabled={disabled || isPending}
          />
          <span style={pillStyle(activeAddressPublic, "exclude")}>지번 제외 공개</span>
        </label>
      </div>
    </div>
  );
};

export default AddressVisibility;

-----------------------
Console Error

Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

See more info here: https://nextjs.org/docs/messages/react-hydration-error


  ...
    <CreateListings>
      <div>
        <CreateClient>
          <BuildForm mode="create" methods={{control:{...}, ...}} isSubmitting={false} onSubmit={function onSubmit} ...>
            <FormProvider control={{...}} subscribe={function subscribe} trigger={function trigger} ...>
              <form onSubmit={function} className="space-y-4" encType="multipart/...">
                <Container title="위치정보">
                  <div className="w-full mx-...">
                    <h3>
                    <div className="p-4 space-...">
                      <LocationCard>
                        <div className="p-4 space-...">
                          <div>
                          <div>
                          <div>
                          <AddressVisibility activeAddressPublic="public" handleRadioChange={function handleRadioChange} ...>
                            <div className="flex flex-col">
                              <label>
                              <div className="flex items...">
                                <label
+                                 htmlFor="addr-public-s6kietxeo-public"
-                                 htmlFor="addr-public-p32zu4x1tll-public"
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="radio"
+                                   id="addr-public-s6kietxeo-public"
-                                   id="addr-public-p32zu4x1tll-public"
+                                   name="addr-public-s6kietxeo"
-                                   name="addr-public-44eaoe2outy"
                                    value="public"
                                    className="hidden"
                                    checked={true}
                                    onChange={function onChange}
                                    disabled={false}
                                  >
                                  ...
                                <label
+                                 htmlFor="addr-public-s6kietxeo-private"
-                                 htmlFor="addr-public-p32zu4x1tll-private"
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="radio"
+                                   id="addr-public-s6kietxeo-private"
-                                   id="addr-public-p32zu4x1tll-private"
+                                   name="addr-public-s6kietxeo"
-                                   name="addr-public-44eaoe2outy"
                                    value="private"
                                    className="hidden"
                                    checked={false}
                                    onChange={function onChange}
                                    disabled={false}
                                  >
                                  ...
                                <label
+                                 htmlFor="addr-public-s6kietxeo-exclude"
-                                 htmlFor="addr-public-p32zu4x1tll-exclude"
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="radio"
+                                   id="addr-public-s6kietxeo-exclude"
-                                   id="addr-public-p32zu4x1tll-exclude"
+                                   name="addr-public-s6kietxeo"
-                                   name="addr-public-44eaoe2outy"
                                    value="exclude"
                                    className="hidden"
                                    checked={false}
                                    onChange={function onChange}
                                    disabled={false}
                                  >
                                  ...
                          ...
                ...
    ...
Call Stack
21

Show 15 ignore-listed frame(s)
input
<anonymous> (0:0)
AddressVisibility
.next\static\chunks\src_app_401776ad._.js (379:231)
LocationCard
.next\static\chunks\src_app_401776ad._.js (664:215)
BuildForm
.next\static\chunks\src_app_401776ad._.js (3750:233)
CreateClient
.next\static\chunks\src_app_401776ad._.js (3975:214)
CreateListings
rsc:/Server/C:%5Cproj%5Cchilgok%5Cfront%5C.next%5Cserver%5Cchunks%5Cssr%5C_21a6dc8f._.js (96:270)
Was this helpful