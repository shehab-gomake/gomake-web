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
export const currenciesSymbols = atom<{ label: string; value: string }[]>({
  key: "currenciesSymbolsState",
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
    isHideInDuplicate?: boolean;
  }[]
>({
  key: "materialHeadersState",
  default: [],
});
export const materialActionState = atom<
  {
    key: string;
    text?: string;
    action: EMaterialsActions;
    icon: string;
    isUnderLine: boolean;
    isShowSubMenu?: boolean;
  }[]
>({
  key: "materialActionState",
  default: [],
});
export const materialCategoriesState = atom<
  {
    categoryKey: string;
    categoryName: string;
    isDeletable: boolean;
    imageURL?: string | null;
    additionalAttributes?: any;
  }[]
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
export const isEditCategoryModalState = atom<boolean>({
  key: "isEditCategoryModalState",
  default: false,
});
export const isDuplicateCategoryModalState = atom<boolean>({
  key: "isDuplicateCategoryModalState",
  default: false,
});
export const selectedCategoryModalState = atom({
  key: "selectedCategoryModalState",
  default: {},
});

export const materialCategorySuppliersState = atom<
  { value: string; label: string; isDefault: boolean; order?: number, name?: string, id?: string }[]
>({
  key: "materialCategorySuppliersState",
  default: [],
});

export const selectedSupplierIdState = atom<string>({
  key: "selectedSupplierIdState",
  default: "",
});

export const selectedSuppliersIdsState = atom<string[]>({
  key: "selectedSuppliersIdsState",
  default: [],
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
export const openUpdatedNumburingModalState = atom<boolean>({
  key: "openUpdatedNumburingModalState",
  default: false,
});

export const openCreatePurchaseOrderModalState = atom<boolean>({
  key: "openCreatePurchaseOrderModalState",
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

export const materialsParametersState = atom<[]>({
  key: "materialsParametersState",
  default: [],
});

export const materialsTablePageState = atom<number>({
  key: "materialsTablePageState",
  default: 1,
});

export const pagesCountState = atom<number>({
  key: "pagesCountState",
  default: 0,
});

export const inActiveFilterState = atom<boolean>({
  key: "inActiveFilterState",
  default: false,
});

export const categoryNumberingState = atom<{}>({
  key: "categoryNumberingState",
  default: {},
});

export const isAllMaterialsCheckedState = atom<boolean>({
  key: "isAllMaterialsCheckedState",
  default: false,
});
export const materialsUnCheckedState = atom<string[]>({
  key: "materialsUnCheckedState",
  default: [],
});

export const selectedMaterialIdForUpdateState = atom<string>({
  key: "selectedMaterialIdForUpdateState",
  default: "",
});

export const materialTypeTableState = atom<any>({
  key: "materialTypeTableState",
  default: {},
});

export const openChildTableState = atom<{ rowId: string; tableType: 'inventory' | 'purchasePricing' | null }>({
  key: "openChildTableState",
  default: { rowId: '', tableType: null },
});

export const inventoryDataState = atom<any[]>({
  key: "inventoryDataState",
  default: [],
});

export const purchasePricingDataState = atom<any[]>({
  key: "purchasePricingDataState",
  default: [],
});

export const isLoadingInventoryState = atom<boolean>({
  key: "isLoadingInventoryState",
  default: false,
});

export const isLoadingPurchasePricingState = atom<boolean>({
  key: "isLoadingPurchasePricingState",
  default: false,
});

export const openJobsModalState = atom<{ 
  open: boolean; 
  supplierName?: string; 
  materialCode?: string; 
  materialName?: string; 
}>({
  key: "openJobsModalState",
  default: { open: false },
});

export const inventoryTableHeadingUnitsState = atom<{
  inventoryUnit?: string;
  pricingUnit?: string;
}>({
  key: "inventoryTableHeadingUnitsState",
  default: {},
});

export const purchasePricingTableHeadingUnitsState = atom<{
  inventoryUnit?: string;
  pricingUnit?: string;
}>({
  key: "purchasePricingTableHeadingUnitsState",
  default: {},
});

export const showMoreFiltersState = atom<boolean>({
  key: "showMoreFiltersState",
  default: false,
});