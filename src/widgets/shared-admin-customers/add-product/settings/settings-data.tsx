export type ProductClient = {
  label: string;
  id: number;
};
export enum EProductClient {
  ALL_CUSTOMERS = 1,
  BY_CLIENT = 2,
  BY_CLIENT_TYPE = 3,
}

export enum EProductProfites {
  BY_ACTION = 0,
  BY_PRODUCT = 1,
}
