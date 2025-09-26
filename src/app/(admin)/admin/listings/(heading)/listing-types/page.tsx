import ListManager from "@adminShared/ListManager";

const ListingTypes = () => {
  return (
    <ListManager
      title="매물 종류 설정"
      placeholder="새로운 매물 종류"
      buttonText="매물 종류 등록"
      apiEndpoint="/api/property-types"
      enableImageUpload={true}
    />
  );
};

export default ListingTypes;
