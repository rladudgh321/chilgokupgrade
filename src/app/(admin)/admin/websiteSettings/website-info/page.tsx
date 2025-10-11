"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema for form validation
const workInfoSchema = z.object({
  companyName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  mobile: z.string().optional().nullable(),
  email: z.string().email({ message: "유효한 이메일을 입력해주세요." }).optional().nullable().or(z.literal('')),
  owner: z.string().optional().nullable(),
  businessId: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

type WorkInfoFormData = z.infer<typeof workInfoSchema>;

// API fetch function using fetch
const getWorkInfo = async (): Promise<WorkInfoFormData> => {
  const response = await fetch("/api/admin/website-info");
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// API post function using fetch
const postWorkInfo = async (data: WorkInfoFormData): Promise<any> => {
  const response = await fetch("/api/admin/website-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save data");
  }
  return response.json();
};

const WebsiteInfoPage = () => {
  const queryClient = useQueryClient();

  const { data: workInfo, isLoading } = useQuery<WorkInfoFormData>({
    queryKey: ["workInfo"],
    queryFn: getWorkInfo,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WorkInfoFormData>({
    resolver: zodResolver(workInfoSchema),
    values: workInfo || {},
  });

  const mutation = useMutation({
    mutationFn: postWorkInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workInfo"] });
      alert("정보가 성공적으로 저장되었습니다.");
    },
    onError: (error) => {
      console.error("Error saving data:", error);
      alert(`오류가 발생했습니다: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<WorkInfoFormData> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">웹사이트 정보 관리</h1>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">웹사이트 정보 관리</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">회사명</label>
              <input
                id="companyName"
                {...register("companyName")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700">대표자</label>
              <input
                id="owner"
                {...register("owner")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="businessId" className="block text-sm font-medium text-gray-700">사업자번호</label>
              <input
                id="businessId"
                {...register("businessId")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">주소</label>
              <input
                id="address"
                {...register("address")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">전화</label>
              <input
                id="phone"
                {...register("phone")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">휴대폰</label>
              <input
                id="mobile"
                {...register("mobile")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || mutation.isPending}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting || mutation.isPending ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebsiteInfoPage;
