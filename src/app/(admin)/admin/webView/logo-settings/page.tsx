'use client';

import SingleImageUploader from "@/app/(admin)/shared/SingleImageUploader";

const LogoSettingsPage = () => {
  return (
    <SingleImageUploader
      title="로고 관리"
      getApiEndpoint="/api/admin/settings/logo"
      updateApiEndpoint="/api/admin/settings/logo"
      uploadApiEndpoint="/api/admin/settings/logo/upload"
      imageMaxWidthOrHeight={200}
    />
  );
};

export default LogoSettingsPage;
