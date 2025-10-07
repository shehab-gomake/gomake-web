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
  selectedSuppliersIdsState,
  hasMoreDataState,
  isLoadingMoreState,
  totalItemsCountState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { getMaterialCategoryDataApi } from "@/services/api-service/materials/materials-endpoints";
import { useState } from "react";
import { isLoadingMaterialsState, userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertValueToOriginalUnit } from "@/utils/helpers";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { getPrintHouseMaterialCategoryDataNewApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const useMaterialsCategories = (isAdmin: boolean) => {
  const [inActiveFilter, setInActiveFilter] = useRecoilState(inActiveFilterState);
  const { callApi } = useGomakeAxios();
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<IMaterialCategoryRow[]>(
    materialCategoryDataState
  );
  const setMaterialTableFilters = useSetRecoilState<IMaterialsTableFilter[]>(
    materialTableFiltersState
  );
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);
  const suppliersIds = useRecoilValue(selectedSuppliersIdsState);

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
  const [hasMoreData, setHasMoreData] = useRecoilState(hasMoreDataState);
  const [isLoadingMore, setIsLoadingMore] = useRecoilState(isLoadingMoreState);
  const [totalItemsCount, setTotalItemsCount] = useRecoilState(totalItemsCountState);
  const loadingRef = useState(() => ({ current: false }))[0];
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
    pageSize?: number,
    appendMode: boolean = false
  ) => {
    if (appendMode) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingMaterials(true);
    }
    if (requestAbortController) {
      requestAbortController.abort();
    }
    const newRequestAbortController = new AbortController();
    setRequestAbortController(newRequestAbortController);
    const callBack = (res) => {
      if (appendMode) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingMaterials(false);
      }
      if (res.success) {
        const newData = res.data?.result?.data?.map((row) => {
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
        });

        if (appendMode) {
          setMaterialCategoryData([...materialCategoryData, ...newData]);
        } else {
          setMaterialCategoryData(newData);
        }

        const totalItems = res.data?.result?.totalItems || 0;
        setTotalItemsCount(totalItems);
        setPagesCount(Math.ceil(totalItems / pageSize));

        // Check if there's more data to load
        const currentDataLength = appendMode ? materialCategoryData.length + newData.length : newData.length;
        setHasMoreData(currentDataLength < totalItems);

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
        if (!appendMode) {
          setMaterialCategoryData([]);
          setPagesCount(0);
          setMaterialTableFilters([]);
          setHasMoreData(false);
        }
        setIsLoadingMaterials(false);
        setIsLoadingMore(false);
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
        supplierId: null,
        suppliersIds: suppliersIds,
        pageNumber,
        pageSize,
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


  const loadMoreData = async (
    materialType: string,
    materialCategory: string,
    customFiltersKeyValueList: IMaterialTableFilteringValue[],
    supplierId: string,
    pageSize: number = 20
  ) => {
    // Double check to prevent concurrent calls
    if (isLoadingMore || !hasMoreData || loadingRef.current) return;

    // Set ref immediately to block other calls
    loadingRef.current = true;

    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);

    try {
      await getMaterialCategoryData(
        materialType,
        materialCategory,
        customFiltersKeyValueList,
        supplierId,
        nextPage,
        pageSize,
        true // appendMode
      );
    } finally {
      // Reset the ref after completion
      loadingRef.current = false;
    }
  };

  return {
    getMaterialCategoryData,
    loadMoreData,
    pagesCount,
    pageNumber,
    setPageNumber,
    hasMoreData,
    isLoadingMore,
    totalItemsCount,
  };
};

export { useMaterialsCategories };
