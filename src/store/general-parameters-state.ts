import {atom, selector} from "recoil";
import {workFlowsState} from "@/widgets/product-pricing-widget/state";
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
  key: 'itemParmetersValuesState',
  get: ({get}) => {
    const subProducts = get(subProductsParametersState);
    const result = [];
    subProducts.forEach(subProduct=>{
      subProduct?.parameters?.forEach(param =>{
        const paramCopy = cloneDeep(param);
        paramCopy.subProductType = subProduct.type;
        result.push(paramCopy)
      })
    })
    //const allParameters = subProducts.flatMap((item) => item.parameters?.map(x=>x.subProductType = item.sectionName));
    const filteredArray = result.filter(
        (obj) => obj.values[0] !== "false"
    );
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
  key: 'quantityParameterState',
  get: ({get}) => {
    const generalParameters = get(generalParametersState);
    const quantity = generalParameters?.find(
        (item) => item?.parameterId === "4991945c-5e07-4773-8f11-2e3483b70b53"
    )
    return !!quantity ? +quantity?.values[0] : 0;
  },
});
export const currentCalculationConnectionId = atom({
  key: "currentCalculationConnectionIdState",
  default: "",
});