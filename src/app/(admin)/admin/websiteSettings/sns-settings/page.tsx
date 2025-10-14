'use client';

import ListManager from "@adminShared/ListManager";

const SnsSettingsPage = () => {
  return (
    <ListManager
      title="SNS 설정"
      placeholder="새로운 SNS 링크"
      buttonText="SNS 추가"
      apiEndpoint="/api/sns-settings"
      enableImageUpload={true}
      enableUrlInput={true}
    />
  );
};

export default SnsSettingsPage;
