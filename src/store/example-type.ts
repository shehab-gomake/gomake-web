import { atom, selector } from "recoil";
import { useGomakeAxios } from "@/hooks";

const exampleTypeSelector = selector({
  key: "mySelectorExampleType",
  get: async ({ get }) => {
    try {
      const { callApi } = useGomakeAxios();
      const res = await callApi(
        "Get",
        "/v1/erp-service/product-item-value-drafts/get-proof-types"
      );
      return res?.data?.data?.data || [];
    } catch (error) {
      console.error("Error fetching example types:", error);
      return [];
    }
  },
});

export const exampleTypeState = atom({
  key: "exampleTypeState",
  default: exampleTypeSelector,
});
