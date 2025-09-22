export interface IBuild {
  id?: number;

  // 주소 정보
  address?: string;
  dong?: string;
  ho?: string;
  etc?: string;
  isAddressPublic?: 'public' | 'private' | 'exclude'; // enum 사용 시 수정
  mapLocation?: string;

  // LandInfo
  propertyType?: string;
  dealType?: string;
  dealScope?: string;
  visibility?: boolean;
  priceDisplay?: string;
  salePrice?: string;
  actualEntryCost?: string;
  rentalPrice?: string;
  managementFee?: string;
  managementEtc?: string;

  // BuildBasic
  popularity?: string[];
  label?: string;
  floorType?: string;
  currentFloor?: number;
  totalFloors?: number;
  basementFloors?: number;
  floorDescription?: string;
  rooms?: number;
  bathrooms?: number;
  actualArea?: number;
  supplyArea?: number;
  landArea?: number;
  buildingArea?: number;
  totalArea?: number;
  themes?: string[]; // Json → any[] 또는 Record<string, any>
  buildingOptions?: string[]; // Json
  constructionYear?: Date | string | null;
  permitDate?: Date | string | null;
  approvalDate?: Date | string | null;
  parkingPerUnit?: number;
  totalParking?: number;
  parkingFee?: number;
  parking?: string[] | string; // Json
  direction?: string;
  directionBase?: string;
  landUse?: string;
  landType?: string;
  buildingUse?: string;
  staff?: string;
  customerType?: string;
  customerName?: string;

  // BuildInfo
  elevatorType?: string;
  elevatorCount?: number;
  moveInType?: string;
  moveInDate?: Date | string | null;
  heatingType?: string;
  yieldType?: string;
  otherYield?: string;
  contractEndDate?: Date | string | null;
  buildingName?: string;
  floorAreaRatio?: string;
  otherUse?: string;
  mainStructure?: string;
  height?: string;
  roofStructure?: string;

  // 상세 설명
  title?: string;
  editorContent?: string;
  secretNote?: string;
  secretContact?: string;

  // 이미지 관련
  mainImage?: string;
  subImage?: string[] | string; // Json
  adminImage?: string[] | string; // Json

  // 자동 생성 필드
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
