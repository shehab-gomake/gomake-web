import {atom} from "recoil";
export interface IQuickSetupProduct {
    id: string;
    details: Record<string, string>;
    quantities: number[];
}

export interface IQuantityPrice {
    quantity: number;
    price: number;
}
export const quickSetupProductsState = atom<IQuickSetupProduct[]>({
    key: '',
    default: []
});

export const quickSetupCurrentProductIndexState = atom<number | null>({
    key: 'quickSetupCurrentProductIndexState',
    default: null
});

export const updatedQuantitiesPriceState = atom<IQuantityPrice[]>({
    key: 'updatedQuantitiesPriceState',
    default: []
})