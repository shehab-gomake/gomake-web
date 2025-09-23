import { useGomakeAxios } from "@/hooks";
import {
  IMaterialCategoryRow,
  IMaterialsTableFilter,
  IMaterialTableFilteringValue,
} from "@/widgets/materials-widget/interface";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  categoryNumberingState,
  inActiveFilterState,
  isAllMaterialsCheckedState,
  materialCategoryDataState,
  materialCategorySuppliersState,
  materialsTablePageState,
  materialTableFiltersState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { getMaterialCategoryDataApi } from "@/services/api-service/materials/materials-endpoints";
import { useState } from "react";
import { isLoadingMaterialsState, userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertValueToOriginalUnit } from "@/utils/helpers";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { EDataTypeEnum } from "./components/table-cell-data/data-type-enum";
import { getPrintHouseMaterialCategoryDataNewApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const useMaterialsCategories = (isAdmin: boolean) => {
  const [inActiveFilter, setInActiveFilter] = useRecoilState(inActiveFilterState);
  const { callApi } = useGomakeAxios();
  const setMaterialCategoryData = useSetRecoilState<IMaterialCategoryRow[]>(
    materialCategoryDataState
  );
  const setMaterialTableFilters = useSetRecoilState<IMaterialsTableFilter[]>(
    materialTableFiltersState
  );
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);

  const [pagesCount, setPagesCount] = useState(0);
  const [pageNumber, setPageNumber] = useRecoilState(materialsTablePageState);
  const [categoryNumbering, setCategoryNumbering] = useRecoilState(
    categoryNumberingState
  );
  const isAllMaterialsChecked = useRecoilValue<boolean>(
    isAllMaterialsCheckedState
  );
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0
  const [requestAbortController, setRequestAbortController] = useState<AbortController | null>(null);
  const setMaterialCategorySuppliers = useSetRecoilState(
    materialCategorySuppliersState
  );
  const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
  const [supplierId, setSupplierId] = useRecoilState(selectedSupplierIdState);
  const getPrintHouseMaterialCategorySuppliers = async (
    materialType: string,
    materialCategory: string
  ) => {
    // resetMaterialCategoryData();

    const callBack = (res) => {
      if (res.success) {
        const supplier = res?.data[0];
        setSupplierId(supplier?.id);

        setMaterialCategorySuppliers(
          res?.data?.map((supplier) => {
            if (supplier.isDefault) {
              setDefaultSupplier(supplier.id);
            }
            return {
              isDefault: supplier.isDefault,
              value: supplier.id,
              label: supplier.name,
              order: supplier?.order,
              name: supplier?.name,
              id: supplier?.id,
            };
          })
        );
      }
    };
    await getMaterialSuppliersApi(callApi, callBack, {
      key: materialType,
      categoryName: materialCategory,
    },

    );
  };
  const setIsLoadingMaterials = useSetRecoilState(isLoadingMaterialsState);
  const getMaterialCategoryData = async (
    materialType: string,
    materialCategory: string,
    customFiltersKeyValueList: IMaterialTableFilteringValue[],
    supplierId: string,
    pageNumber?: number,
    pageSize?: number
  ) => {
    setIsLoadingMaterials(true);
    if (requestAbortController) {
      requestAbortController.abort();
    }
    const newRequestAbortController = new AbortController();
    setRequestAbortController(newRequestAbortController);
    const callBack = (res) => {
      setIsLoadingMaterials(false);
      if (res.success) {
        setMaterialCategoryData(
          res.data?.result?.data?.map((row) => {
            // Add mock data for new columns
            const newRow = { ...row, checked: false };

            // Handle SKU from API response (top level)
            if (row.sku !== null && row.sku !== undefined && row.sku !== "") {
              newRow.rowData.sku = {
                value: row.sku,
                isEditable: true,
                type: 1 // NUMBER
              };
            }

            // Handle isActive from API response (top level)
            if (row.isActive !== null && row.isActive !== undefined) {
              newRow.rowData.Active = {
                value: row.isActive,
                isEditable: true,
                type: 2 // BOOLEAN
              };
            }

            return newRow;
          })
        );
        setPagesCount(Math.ceil(res.data?.result?.totalItems / pageSize));
        const filters = res.data?.filters;
        setMaterialTableFilters(filters);
        setInActiveFilter(res.data?.setInActiveFilter);
        setCategoryNumbering(res.data?.categoryNumbering);
        if (supplierId === "" || supplierId === null || supplierId === undefined) {
          getPrintHouseMaterialCategorySuppliers(
            materialType?.toString(),
            materialCategory?.toString()
          ).then();
        }
      } else {
        setMaterialCategoryData([]);
        setPagesCount(0);
        setMaterialTableFilters([]);
        setIsLoadingMaterials(false);
      }
    };
    const convertedCustomFiltersKeyValueList = customFiltersKeyValueList.map(filter => {
      if (filter.unit && typeof filter.value === 'string' && filter.value.includes('X')) {
        const [width, height] = filter.value.split('X').map(part =>
          unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(filter.unit, part.trim()) : part.trim()
        );
        return {
          ...filter,
          value: `${width}X${height}`
        };
      } else if (filter.unit) {
        return {
          ...filter,
          value: unitType === UNIT_TYPE.IMPERIAL ? convertValueToOriginalUnit(filter.unit, filter.value) : filter.value
        };
      }
      return filter;
    });
    const isActive =
      activeFilter === EMaterialActiveFilter.ACTIVE
        ? true
        : activeFilter === EMaterialActiveFilter.INACTIVE
          ? false
          : null;
    if (isAdmin) {
      const data = await getMaterialCategoryDataApi(callApi, callBack, {
        materialKey: materialType,
        categoryKey: materialCategory,
        pageNumber,
        pageSize,
        customFiltersKeyValueList: convertedCustomFiltersKeyValueList,
      }).catch((e) => { });
    } else {
      await getPrintHouseMaterialCategoryDataNewApi(callApi, callBack, {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId: supplierId === "" ? null : supplierId,
        // pageNumber,
        // pageSize,
        isActive,
        customFiltersKeyValueList: convertedCustomFiltersKeyValueList,
      },
        false,
        newRequestAbortController
      ).catch((e) => {
        setMaterialCategoryData([]);
        setPagesCount(0);
        setMaterialTableFilters([]);
      });

    }
  };


  return {
    getMaterialCategoryData,
    pagesCount,
    pageNumber,
    setPageNumber,
  };
};

export { useMaterialsCategories };
