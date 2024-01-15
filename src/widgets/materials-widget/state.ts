import { atom } from "recoil";
import {
  IMaterialCategoryRow,
  IMaterialsTableFilter,
  IMaterialTableFilteringValue,
} from "@/widgets/materials-widget/interface";
import {
  EFilterType,
  EMaterialActiveFilter,
  EMaterialsActions,
} from "@/widgets/materials-widget/enums";

export const currenciesState = atom<{ label: string; value: string }[]>({
  key: "currenciesState",
  default: [],
});
export const materialHeadersState = atom<
  {
    key: string;
    value: string;
    unit?: string;
    filterType: EFilterType;
    isFilter: boolean;
    inputType: number;
    values: [];
  }[]
>({
  key: "materialHeadersState",
  default: [],
});
export const materialActionState = atom<
  {
    key: string;
    action: EMaterialsActions;
    icon: string;
    isUnderLine: boolean;
  }[]
>({
  key: "materialActionState",
  default: [],
});
export const materialCategoriesState = atom<
  { categoryKey: string; categoryName: string; isAddedByPrintHouse: boolean }[]
>({
  key: "materialCategoriesState",
  default: [],
});
export const materialCategoryDataState = atom<IMaterialCategoryRow[]>({
  key: "materialCategoryDataState",
  default: [],
});
export const materialTableFiltersState = atom<IMaterialsTableFilter[]>({
  key: "materialTableFiltersState",
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

export const materialCategorySuppliersState = atom<
  { value: string; label: string; isDefault: boolean }[]
>({
  key: "materialCategorySuppliersState",
  default: [],
});

export const selectedSupplierIdState = atom<string>({
  key: "selectedSupplierIdState",
  default: "",
});

export const activeFilterState = atom<EMaterialActiveFilter>({
  key: "activeFilterState",
  default: EMaterialActiveFilter.ACTIVE,
});

export const filterState = atom<IMaterialTableFilteringValue[]>({
  key: "filterState",
  default: [],
});

export const flagState = atom<boolean>({
  key: "flagState",
  default: false,
});

export const openAddRowModalState = atom<boolean>({
  key: "openAddRowModalState",
  default: false,
});

export const materialsMachinesState = atom<[]>({
  key: "materialsMachinesState",
  default: [],
});

export const materialsClientsState = atom<[]>({
  key: "materialsClientsState",
  default: [],
});

export const materialsTablePageState = atom<number>({
  key: "materialsTablePageState",
  default: 1,
});

export const isAllMaterialsCheckedState = atom<boolean>({
  key: "isAllMaterialsCheckedState",
  default: false,
});

export const materialsUnCheckedState = atom<string[]>({
  key: "materialsUnCheckedState",
  default: [],
});