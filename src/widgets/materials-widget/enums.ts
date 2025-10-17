export enum EMaterialsActions {
  UpdateCurrency = 0,
  UpdateIsActive,
  UpdateIsInActive,
  UpdatePricePerTon,
  UpdatePricePerUnit,
  UpdatePricePerTonPercents,
  UpdatePricePerUnitPercents,
  ActionTest1,
  ActionTest2,
  AddNew,
  Duplicate,
  Delete,
  DownLoadExcel,
  UploadExcel,
  UploadMaterialsPictures,
  CreatePurchaseOrder,
  sku,
}

export enum EMaterialActiveFilter {
  ALL,
  ACTIVE,
  INACTIVE,
}

export enum EFilterType {
  TEXT,
  SELECT,
}

export enum MaterialStockUnit {
  Units = 0,
  Liter,
  Meter,
  SquareMeter,
}

export enum ExistingSupplierActionEnum {
  ActivateOnly = 0,
  ActivateAndOverride = 1,
}