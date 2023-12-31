import {atom, selector} from "recoil";

export const generalParametersState = atom({
    key: "generalParametersState",
    default: [],
});
export const subProductsParametersState = atom({
    key: "subProductsParametersState",
    default: [],
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
export const productTypesNumberState = selector<number>({
    key: 'productTypesNumberState',
    get: ({get}) => {
        const generalParameters = get(subProductsCopyParametersState);
        const section = generalParameters[0];
        let typesParameterValue = 0;
        if (!!section) {
            const typesParameter = section?.parameters?.find((item) => item?.parameterId === "de2bb7d5-01b1-4b2b-b0fa-81cd0445841b")
          typesParameterValue =!!typesParameter &&  typesParameter?.values?.length > 0 ?  +typesParameter?.values[0] : 0
        }
        return typesParameterValue;
    },
});
