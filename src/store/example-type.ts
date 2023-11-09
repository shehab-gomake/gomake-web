import { atom, selector } from "recoil";
import { useGomakeAxios } from "@/hooks";

const exampleTypeSelector = selector({
  key: "mySelectorExampleType",
  get: async ({ get }) => {
    const { callApi } = useGomakeAxios();
    const res = await callApi("Get", "/v1/enum/get-enums/ExampleType");
    console.log("result", res);
    return res?.data?.data?.data;
  },
});

export const exampleTypeState = atom({
  key: "exampleTypeState",
  default: exampleTypeSelector,
});
