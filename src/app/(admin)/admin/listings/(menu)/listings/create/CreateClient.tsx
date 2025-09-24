"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import BuildForm, { BASE_DEFAULTS, FormData } from "@/app/(admin)/admin/listings/(menu)/listings/shared/BuildForm";
import { BuildCreate } from "@/app/apis/build";

export default function CreateClient() {
  const router = useRouter();
  const methods = useForm<FormData>({ defaultValues: BASE_DEFAULTS });

  const { mutate, isPending } = useMutation({
    mutationFn: BuildCreate,
    onSuccess: () => router.back(),
    onError: () => alert("등록 중 에러가 발생했습니다."),
  });

  return (
    <BuildForm
      mode="create"
      methods={methods}
      isSubmitting={isPending}
      onSubmit={(data) => mutate(data)}
      onCancel={() => router.back()}
    />
  );
}
