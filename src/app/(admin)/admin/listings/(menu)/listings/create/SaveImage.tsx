"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { uploadImage, uploadImages } from "@/app/apis/build";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const SaveImage: React.FC = () => {
  const { setValue } = useFormContext();

  const [mainImage, setMainImage] = useState<string | null>(null);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [adminImages, setAdminImages] = useState<string[]>([]);

  const mainImageRef = useRef<HTMLInputElement>(null);
  const propertyImageRef = useRef<HTMLInputElement>(null);
  const adminImageRef = useRef<HTMLInputElement>(null);

  // 대표 이미지 mutation
  const mainImageMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      console.log("대표 이미지 업로드 응답:", data);
      const fullUrl = `${baseURL}${data.url}`;
      console.log('fullUrl', fullUrl);
      console.log('mainImage', mainImage);
      setMainImage(fullUrl);
      setValue("mainImage", fullUrl);
    },
  });

  // 매물 이미지 mutation
  const propertyImagesMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (data) => {
      const newImages = data.urls.map((url: string) => `${baseURL}${url}`);
      setPropertyImages((prev) => {
        const updated = [...prev, ...newImages];
        setValue("subImage", updated);
        return updated;
      });
    },
  });

  // 관리자 이미지 mutation
  const adminImagesMutation = useMutation({
    mutationFn: uploadImages,
    onSuccess: (data) => {
      const newImages = data.urls.map((url: string) => `${baseURL}${url}`);
      setAdminImages((prev) => {
        const updated = [...prev, ...newImages];
        setValue("adminImage", updated);
        return updated;
      });
    },
  });

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      mainImageMutation.mutate(formData);
    }
  };

  const handlePropertyImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file1", file));
      propertyImagesMutation.mutate(formData);
    }
  };

  const handleAdminImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file2", file));
      adminImagesMutation.mutate(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 대표 사진 */}
      <div className="mb-4">
        <label className="block text-xl font-semibold">매물 대표 사진</label>
        <input
          type="file"
          accept="image/*"
          ref={mainImageRef}
          onChange={handleMainImage}
          className="mt-2"
        />
        {mainImage && (
          <div className="mt-2">
            <Image src={mainImage} alt="대표 사진" width={300} height={300} />
          </div>
        )}
      </div>

      {/* 매물 사진들 */}
      <div className="mb-4">
        <label className="block text-xl font-semibold">매물 사진들</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={propertyImageRef}
          onChange={handlePropertyImages}
          className="mt-2"
        />
        {propertyImages.length > 0 && (
          <div className="mt-2">
            {propertyImages.map((img, idx) => (
              <Image key={idx} src={img} alt={`매물 ${idx + 1}`} width={300} height={300} className="mt-2" />
            ))}
          </div>
        )}
      </div>

      {/* 관리자 전용 사진들 */}
      <div className="mb-4">
        <label className="block text-xl font-semibold">관리자만 볼 수 있는 사진들</label>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={adminImageRef}
          onChange={handleAdminImages}
          className="mt-2"
        />
        {adminImages.length > 0 && (
          <div className="mt-2">
            {adminImages.map((img, idx) => (
              <Image key={idx} src={img} alt={`관리자 ${idx + 1}`} width={300} height={300} className="mt-2" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SaveImage;
