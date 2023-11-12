import {atom} from "recoil";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";
import {EFilterType, EMaterialActiveFilter, EMaterialsActions} from "@/widgets/materials-widget/enums";

export const currenciesState = atom<{label: string, value: string}[]>({
    key: "currenciesState",
    default: [],
});
export const materialHeadersState = atom<{
    key: string;
    value: string;
    filterType: EFilterType
    isFilter: boolean
}[]>({
    key: "materialHeadersState",
    default: [],
});
export const materialActionState = atom<{ key: string; action: EMaterialsActions; }[]>({
    key: "materialActionState",
    default: [],
});
export const materialCategoriesState = atom<{ categoryKey: string, categoryName: string , isAddedByPrintHouse : boolean  }[]>({
    key: "materialCategoriesState",
    default: [],
});
export const materialCategoryDataState = atom<IMaterialCategoryRow[]>({
    key: "materialCategoryDataState",
    default: [],
});

export const openAddSupplierModalState = atom<boolean>({
    key: "openAddSupplierModalState",
    default: false,
});

export const openAddCategoryModalState = atom<boolean>({
    key: "openAddCategoryModalState",
    default: false,
});

export const materialCategorySuppliersState = atom<{value: string; label: string; isDefault: boolean;}[]>({
    key: 'materialCategorySuppliersState',
    default: []
});

export const selectedSupplierIdState = atom<string>({
    key: 'selectedSupplierIdState',
    default: ''
});

export const activeFilterState = atom<EMaterialActiveFilter>({
    key: 'activeFilterState',
    default: EMaterialActiveFilter.ACTIVE
});

export const filterState = atom<{key: string; value: string} | null>({
    key: 'filterState',
    default: null
})



