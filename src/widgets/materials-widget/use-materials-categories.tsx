import { useGomakeAxios } from "@/hooks";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  materialCategoryDataState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { useState } from "react";
import {getPrintHouseMaterialCategoryDataApi} from "@/services/api-service/materials/printhouse-materials-endpoints";

const useMaterialsCategories = () => {
  const { callApi } = useGomakeAxios();
  const setMaterialCategoryData = useSetRecoilState<IMaterialCategoryRow[]>(
    materialCategoryDataState
  );
  const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);
  const [pagesCount, setPagesCount] = useState(0);
  const getMaterialCategoryData = async (
    materialType: string,
    materialCategory: string,
    supplierId: string,
    pageNumber?: number,
    pageSize?: number
  ) => {
    const callBack = (res) => {
      if (res.success) {
        setMaterialCategoryData(
          res.data?.data?.map((row) => ({ ...row, checked: false }))
        );
        // res.data?.data?.every((row) => !row.isActive)
        //   ? setActiveFilter(EMaterialActiveFilter.ALL)
        //   : setActiveFilter(EMaterialActiveFilter.ACTIVE);
      }
    };
    const isActive =
      activeFilter === EMaterialActiveFilter.ACTIVE
        ? true
        : activeFilter === EMaterialActiveFilter.INACTIVE
        ? false
        : "";
    const data = await getPrintHouseMaterialCategoryDataApi(callApi, callBack, {
      materialKey: materialType,
      categoryKey: materialCategory,
      supplierId,
      pageNumber,
      pageSize,
      isActive,
    });
    setPagesCount(Math.ceil(data?.data?.totalItems / pageSize));
  };

  return {
    getMaterialCategoryData,
    pagesCount,
  };
};

export { useMaterialsCategories };
