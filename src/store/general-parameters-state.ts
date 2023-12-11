import {atom, selector} from "recoil";

export const generalParametersState = atom({
  key: "generalParametersState",
  default: [],
});
export const subProductsParametersState = atom({
  key: "subProductsParametersState",
  default: [],
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
