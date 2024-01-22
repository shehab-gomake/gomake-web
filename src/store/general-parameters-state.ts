import { atom, selector } from "recoil";
import { workFlowsState } from "@/widgets/product-pricing-widget/state";
import cloneDeep from "lodash.clonedeep";

export const generalParametersState = atom({
  key: "generalParametersState",
  default: [],
});
export const subProductsParametersState = atom({
  key: "subProductsParametersState",
  default: [],
});
export const itemParmetersValuesState = selector<any>({
  key: "itemParmetersValuesState",
  get: ({ get }) => {
    const subProducts = get(subProductsParametersState);
    const result = [];
    subProducts.forEach((subProduct) => {
      subProduct?.parameters?.forEach((param) => {
        const paramCopy = cloneDeep(param);
        paramCopy.subProductType = subProduct.type;
        result.push(paramCopy);
      });
    });
    //const allParameters = subProducts.flatMap((item) => item.parameters?.map(x=>x.subProductType = item.sectionName));
    const filteredArray = result.filter((obj) => obj.values[0] !== "false");
    return filteredArray;
  },
});
export const subProductsCopyParametersState = atom({
  key: "subProductsCopyParametersState",
  default: [],
});
export const productTemplateState = atom({
  key: "productTemplateState",
  default: "",
});
export const quantityParameterState = selector({
  key: "quantityParameterState",
  get: ({ get }) => {
    const generalParameters = get(generalParametersState);
    const quantity = generalParameters?.find(
      (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
    );
    return !!quantity ? +quantity?.values[0] : 0;
  },
});
export const productTypesNumberState = selector<number>({
  key: "productTypesNumberState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
    console.log("generalParameters", generalParameters);
    const section = generalParameters[0];
    let typesParameterValue = 0;
    if (!!section) {
      const typesParameter = section?.parameters?.find(
        (item) => item?.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b"
      );
      typesParameterValue =
        !!typesParameter && typesParameter?.values?.length > 0
          ? +typesParameter?.values[0]
          : 0;
    }
    return typesParameterValue;
  },
});
export const productSetsParamState = selector<string>({
  key: "productSetsParamState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
    const section = generalParameters[0];
    let setsParameterValue;
    if (!!section) {
      const setsParameter = section?.parameters?.find(
        (item) => item?.parameterId === "e7ea235e-b5e2-4f0d-aecf-0f435c24afbb"
      );
      setsParameterValue =
        !!setsParameter && setsParameter?.values?.length > 0
          ? setsParameter?.values[0]
          : false;
    }
    return setsParameterValue;
  },
});
export const productSetQuantityState = selector<number>({
  key: "productSetQuantityState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
    const section = generalParameters[0];
    let setsParameterValue;
    if (!!section) {
      const setsParameter = section?.parameters?.find(
        (item) => item?.parameterId === "0fdbca1a-f250-447b-93e3-5b91909da59c"
      );
      setsParameterValue =
        !!setsParameter && setsParameter?.values?.length > 0
          ? setsParameter?.values[0]
          : 0;
    }
    return setsParameterValue;
  },
});
export const productSetsUnitsState = selector<number>({
  key: "productSetsUnitsState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
    const section = generalParameters[0];
    let setsParameterValue;
    if (!!section) {
      const setsParameter = section?.parameters?.find(
        (item) => item?.parameterId === "91d3fe77-b852-4974-beb6-2da7d7616c78"
      );
      setsParameterValue =
        !!setsParameter && setsParameter?.values?.length > 0
          ? setsParameter?.values[0]
          : 0;
    }
    return setsParameterValue;
  },
});
export const currentCalculationConnectionId = atom({
  key: "currentCalculationConnectionIdState",
  default: "",
});
