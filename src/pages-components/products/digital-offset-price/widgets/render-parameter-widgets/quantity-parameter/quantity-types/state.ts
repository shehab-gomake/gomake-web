import {atom, selector} from "recoil";

interface IQuantityTypes {
    quantity: number;
    typeAmount: number;
    equalQuantity: number;
    values: IQuantityTypesValue[];
    duplicatedName: boolean;
}

export interface IQuantityTypesValue {
    name: string;
    quantity: number;
}

export const productQuantityTypesState = atom<IQuantityTypes>({
    key: 'productQuantityTypesState',
    default: {
        quantity: 0,
        typeAmount: 0,
        equalQuantity: 0,
        values: [],
        duplicatedName: false
    }
});

export const productQuantityTypesValuesState = atom<IQuantityTypesValue[]>({
    key: 'productQuantityTypesValuesState',
    default: []
});
export const tempProductQuantityTypesValuesState = atom<IQuantityTypesValue[]>({
    key: 'tempProductQuantityTypesValuesState',
    default: []
});
export const productQuantityTypesEqualQuantityState = selector<number>({
    key: 'productQuantityTypesEqualQuantityState',
    get: ({get}) => {
        const state = get(productQuantityTypesState);
        return state.equalQuantity;
    },
});
export const productQuantityTypesDuplicatedNameState = selector<boolean>({
    key: 'productQuantityTypesDuplicatedNameState',
    get: ({get}) => {
        const state = get(productQuantityTypesState);
        return state.duplicatedName;
    },
});

export const openQuantityComponentModalState = atom<boolean>({
    default: false,
    key: 'openQuantityComponentModalState'
})