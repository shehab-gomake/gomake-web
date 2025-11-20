export type ProductClient = {
  label: string;
  id: number;
};
export enum EProductClient {
  ALL_CUSTOMERS = 0,
  BY_CLIENT = 1,
  BY_CLIENT_TYPE = 2,
}

export enum EProductStructureType {
  BASE = 1,
  COMPOSITE = 2,
}

export enum EProductProfits {
  BY_ACTION = 0,
  BY_PRODUCT = 1,
  BY_RULE,
}