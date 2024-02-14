import { atom } from "recoil";

export const totalDocumentsState = atom<number>({
    key: "totalDocumentsState",
    default: 0,
  });

  export const totalPaymentState = atom<number>({
    key: "totalPaymentState",
    default: 0,
  });

  export const finalTotalPaymentState = atom<number>({
    key: "finalTotalPaymentState",
    default: 0,
  });

  export const totalCashState = atom<number>({
    key: "totalCashState",
    default: 0,
  });

  export const totalBitState = atom<number>({
    key: "totalBitState",
    default: 0,
  });

  export const totalTransferState = atom<number>({
    key: "totalTransferState",
    default: 0,
  });

  export const totalChecksState = atom<number>({
    key: "totalChecksState",
    default: 0,
  });