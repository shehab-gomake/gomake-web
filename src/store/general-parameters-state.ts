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
export const productTemplateState = atom({
  key: "productTemplateState",
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
    const filteredArray = result.filter((obj) => obj.values && obj.values.length && obj.values[0] !== "false");
    return filteredArray;
  },
});
export const subProductsCopyParametersState = atom({
  key: "subProductsCopyParametersState",
  default: [],
});
export const quantityParameterState = selector({
  key: "quantityParameterState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
    const section = generalParameters[0];
    let quantityParameterValue;
    if (!!section) {
      const quantityParameter = section?.parameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
      );
      quantityParameterValue =
        !!quantityParameter && quantityParameter?.values?.length > 0
          ? +quantityParameter?.values[0]
          : 0;
    }
    return quantityParameterValue;
  },
});
export const productTypesNumberState = selector<number>({
  key: "productTypesNumberState",
  get: ({ get }) => {
    const generalParameters = get(subProductsCopyParametersState);
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

export const currentCalculationConnectionId = atom({
  key: "currentCalculationConnectionIdState",
  default: "",
});
