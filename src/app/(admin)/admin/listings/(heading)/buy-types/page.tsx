import ListManager from "@adminShared/ListManager";

const BuyTypes = () => {
  return (
    <ListManager
      title="거래 유형"
      placeholder="새로운 거래유형"
      buttonText="거래유형 등록"
      apiEndpoint="/api/buy-types"
    />
  );
};

export default BuyTypes;
