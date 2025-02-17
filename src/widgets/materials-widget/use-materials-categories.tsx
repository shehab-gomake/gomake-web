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
  materialsTablePageState,
  materialTableFiltersState,
  pagesCountState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { getPrintHouseMaterialCategoryDataApi } from "@/services/api-service/materials/printhouse-materials-endpoints";
import { getMaterialCategoryDataApi } from "@/services/api-service/materials/materials-endpoints";
import { useState } from "react";
import { userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertValueToOriginalUnit } from "@/utils/helpers";

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

  const getMaterialCategoryData = async (
    materialType: string,
    materialCategory: string,
    customFiltersKeyValueList: IMaterialTableFilteringValue[],
    supplierId: string,
    pageNumber?: number,
    pageSize?: number
  ) => {
    const callBack = (res) => {


      if (res.success) {
        setMaterialCategoryData(
          res.data?.result?.data?.map((row) => ({ ...row, checked: false }))
        );
        setPagesCount(Math.ceil(res.data?.result?.totalItems / pageSize));
        const filters = res.data?.filters;
        setMaterialTableFilters(filters);
        setInActiveFilter(res.data?.setInActiveFilter);
        setCategoryNumbering(res.data?.categoryNumbering);
      } else {
        setMaterialCategoryData([]);
        setPagesCount(0);
        setMaterialTableFilters([]);
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
      await getPrintHouseMaterialCategoryDataApi(callApi, callBack, {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId,
        pageNumber,
        pageSize,
        isActive,
        customFiltersKeyValueList: convertedCustomFiltersKeyValueList,
      }).catch((e) => {
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
