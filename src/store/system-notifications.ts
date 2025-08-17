import { atom } from "recoil";

export enum ENotificationType {
  TEXT = 1,
  QUOTE_APPROVED_BY_MANAGER_STATUS,
  QUOTE_REJECTED_BY_MANAGER_STATUS,
  BOARD_MISSIONS_APPROVED_STATUS,
  BOARD_MISSIONS_REJECTED_STATUS,
  QUOTE_APPROVED_STATUS,
  QUOTE_REJECTED_STATUS,
  INVOICE_PAYMENT_REQUEST_PAID_BY_CLIENT = 9,
  ORDER_PAYMENT_REQUEST_PAID_BY_CLIENT = 10,
}
export interface ISystemNotification {
  id: string;
  type: ENotificationType;
  message: string;
  documentId?: string;
  createdDate?: Date;
}
export const systemNotificationsState = atom<ISystemNotification[]>({
  key: "systemNotificationsState",
  default: [],
});
