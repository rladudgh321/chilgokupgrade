"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { uploadImage, uploadImages } from "@/app/apis/build";

type FormShape = {
  mainImage?: string;
  subImage?: string[];
  adminImage?: string[];
};

const isValidImgSrc = (s: unknown): s is string => {
  if (typeof s !== "string") return false;
  const v = s.trim();
  if (!v) return false;
  // 외부 URL 또는 루트 상대경로만 허용
  if (v.startsWith("http://") || v.startsWith("https://")) return true;
  if (v.startsWith("/")) return true;
  return false;
};

const arraysEqual = (a: string[] = [], b: string[] = []) => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

const unique = (arr: string[]) => Array.from(new Set(arr));

const SaveImage: React.FC = () => {
  const { getValues, setValue, watch } = useFormContext<FormShape>();

  // RHF 값 변경 감시(서버에서 reset으로 들어오는 초기값 포함)
  const mainImageField = watch("mainImage");
  const subImageField = watch("subImage");
  const adminImageField = watch("adminImage");

  // 미리보기용 로컬 상태
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [adminImages, setAdminImages] = useState<string[]>([]);

  // ─────────────────────────────────────────────────────────
  //  RHF → 로컬 미리보기 동기화 (렌더 루프 방지: effect + 동등성 체크)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    setMainImage(isValidImgSrc(mainImageField) ? mainImageField : null);
  }, [mainImageField]);

  useEffect(() => {
    const sanitized = Array.isArray(subImageField)
      ? unique(subImageField.filter(isValidImgSrc))
      : [];
    if (!arraysEqual(propertyImages, sanitized)) {
      setPropertyImages(sanitized);
    }
  }, [subImageField, propertyImages]);

  useEffect(() => {
    const sanitized = Array.isArray(adminImageField)
      ? unique(adminImageField.filter(isValidImgSrc))
      : [];
    if (!arraysEqual(adminImages, sanitized)) {
      setAdminImages(sanitized);
    }
  }, [adminImageField, adminImages]);

  // ─────────────────────────────────────────────────────────
  // 업로드 뮤테이션
  // 서버는 절대 URL을 반환한다고 가정({ url } | { urls: string[] })
  // ─────────────────────────────────────────────────────────
  const mainImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data: { url: string }) => {
      const url = data.url;
      if (!isValidImgSrc(url)) return; // 방어
      // 로컬 미리보기 갱신
      setMainImage(url);
      // RHF 값 갱신(동일 값이면 스킵)
      if (getValues("mainImage") !== url) {
        setValue("mainImage", url, { shouldDirty: true });
      }
    },
  });

  const propertyImagesMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (data: { urls: string[] }) => {
      const urls = unique((data.urls || []).filter(isValidImgSrc));
      if (urls.length === 0) return;

      setPropertyImages((prev) => {
        const next = unique([...prev, ...urls]);
        const curr = Array.isArray(getValues("subImage")) ? getValues("subImage")! : [];
        if (!arraysEqual(next, curr)) {
          setValue("subImage", next, { shouldDirty: true });
        }
        return next;
      });
    },
  });

  const adminImagesMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (data: { urls: string[] }) => {
      const urls = unique((data.urls || []).filter(isValidImgSrc));
      if (urls.length === 0) return;

      setAdminImages((prev) => {
        const next = unique([...prev, ...urls]);
        const curr = Array.isArray(getValues("adminImage")) ? getValues("adminImage")! : [];
        if (!arraysEqual(next, curr)) {
          setValue("adminImage", next, { shouldDirty: true });
        }
        return next;
      });
    },
  });

  // ─────────────────────────────────────────────────────────
  // 파일 선택 핸들러
  // /api/image/upload : file
  // /api/image/uploads: file1(매물), file2(관리자)
  // ─────────────────────────────────────────────────────────
  const onPickMain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append("file", f);
    // 필요 시 버킷/프리픽스 지정
    // fd.append("bucket", "build-public");
    // fd.append("prefix", "main");
    mainImageMutation.mutate(fd);
  };

  const onPickSubs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("file1", f));
    // fd.append("bucket", "build-public");
    // fd.append("prefix", "sub");
    propertyImagesMutation.mutate(fd);
  };

  const onPickAdmins = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("file2", f));
    // fd.append("bucket", "build-admin");
    // fd.append("prefix", "admin");
    adminImagesMutation.mutate(fd);
  };

  // ─────────────────────────────────────────────────────────
  // 삭제 핸들러(로컬 + RHF 동기화)
  // ─────────────────────────────────────────────────────────
  const clearMain = () => {
    setMainImage(null);
    setValue("mainImage", "", { shouldDirty: true });
  };

  const removeSubAt = (idx: number) => {
    setPropertyImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setValue("subImage", next, { shouldDirty: true });
      return next;
    });
  };

  const removeAdminAt = (idx: number) => {
    setAdminImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setValue("adminImage", next, { shouldDirty: true });
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-2 sm:p-4">
      {/* 대표 사진 */}
      <div className="mb-6">
        <label className="block text-lg sm:text-xl font-semibold">매물 대표 사진</label>
        <input type="file" accept="image/*" onChange={onPickMain} className="mt-2" />
        {mainImage && isValidImgSrc(mainImage) && (
          <div className="mt-3 flex items-center gap-3">
            <Image src={mainImage} alt="대표 사진" width={300} height={300} className="w-full max-w-[300px] h-auto" />
            <button
              type="button"
              className="px-3 py-1 rounded bg-red-500 text-white"
              onClick={clearMain}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 매물 사진들 */}
      <div className="mb-6">
        <label className="block text-lg sm:text-xl font-semibold">매물 사진들</label>
        <input type="file" accept="image/*" multiple onChange={onPickSubs} className="mt-2" />
        {propertyImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            {propertyImages.filter(isValidImgSrc).map((img, idx) => (
              <div key={img + idx} className="relative">
                <Image src={img} alt={`매물 ${idx + 1}`} width={300} height={300} className="w-full h-auto" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded"
                  onClick={() => removeSubAt(idx)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 관리자 전용 사진들 */}
      <div className="mb-2">
        <label className="block text-lg sm:text-xl font-semibold">관리자만 볼 수 있는 사진들</label>
        <input type="file" accept="image/*" multiple onChange={onPickAdmins} className="mt-2" />
        {adminImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
            {adminImages.filter(isValidImgSrc).map((img, idx) => (
              <div key={img + idx} className="relative">
                <Image src={img} alt={`관리자 ${idx + 1}`} width={300} height={300} className="w-full h-auto" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded"
                  onClick={() => removeAdminAt(idx)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveImage;
