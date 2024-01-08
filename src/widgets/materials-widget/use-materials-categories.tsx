import { useGomakeAxios } from "@/hooks";
import { getMaterialCategoryDataApi } from "@/services/api-service/materials/materials-endpoints";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { useSetRecoilState } from "recoil";
import {
  activeFilterState,
  materialCategoryDataState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { useState } from "react";

const useMaterialsCategories = () => {
  const { callApi } = useGomakeAxios();
  const setActiveFilter = useSetRecoilState(activeFilterState);
  const setMaterialCategoryData = useSetRecoilState<IMaterialCategoryRow[]>(
    materialCategoryDataState
  );
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
        res.data?.data?.every((row) => !row.isActive)
          ? setActiveFilter(EMaterialActiveFilter.ALL)
          : setActiveFilter(EMaterialActiveFilter.ACTIVE);
      }
    };
    const data = await getMaterialCategoryDataApi(callApi, callBack, {
      materialKey: materialType,
      categoryKey: materialCategory,
      supplierId,
      pageNumber,
      pageSize,
    });
    setPagesCount(Math.ceil(data?.data?.totalItems / pageSize));
  };

  return {
    getMaterialCategoryData,
    pagesCount,
  };
};

export { useMaterialsCategories };
