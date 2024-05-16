import { atom, selector } from "recoil";
import { useGomakeAxios } from "@/hooks";

const billingMethodSelector = selector({
  key: "mySelectorBillingMethod",
  get: async ({ get }) => {
    const { callApi } = useGomakeAxios();
    const res = await callApi("Get", "/v1/enum/get-enums/BillingMethod");
    return res?.data?.data?.data;
  },
});

export const billingMethodState = atom({
  key: "billingMethodState",
  default: billingMethodSelector,
});

export const listEmployees = atom({
  key: "listEmployees",
  default: [],
});
