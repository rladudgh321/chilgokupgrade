import ListManager from "@adminShared/ListManager";

const OptionsSettings = () => {
  return (
    <ListManager
      title="옵션 설정"
      placeholder="새로운 옵션"
      buttonText="옵션 등록"
      apiEndpoint="/api/building-options"
    />
  );
};

export default OptionsSettings;