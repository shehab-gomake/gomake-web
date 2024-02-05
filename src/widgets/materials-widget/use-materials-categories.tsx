import { useGomakeAxios } from "@/hooks";
import {
  IMaterialCategoryRow,
  IMaterialsTableFilter,
  IMaterialTableFilteringValue
} from "@/widgets/materials-widget/interface";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  activeFilterState, isAllMaterialsCheckedState,
  materialCategoryDataState, materialsTablePageState, materialTableFiltersState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";
import { useState } from "react";
import {getPrintHouseMaterialCategoryDataApi} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {getMaterialCategoryDataApi} from "@/services/api-service/materials/materials-endpoints";

const useMaterialsCategories = (isAdmin:boolean) => {
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
  const isAllMaterialsChecked = useRecoilValue<boolean>(isAllMaterialsCheckedState);

  const getMaterialCategoryData = async (
    materialType: string,
    materialCategory: string,
    customFiltersKeyValueList: IMaterialTableFilteringValue[],
    supplierId: string,
    pageNumber?: number,
    pageSize?: number,
    
  ) => {
    const callBack = (res) => {
      if (res.success) {
        setMaterialCategoryData(
          res.data?.result?.data?.map((row) => ({ ...row, checked: isAllMaterialsChecked }))
        );
        setPagesCount(Math.ceil( res.data?.result?.totalItems / pageSize));
        const filters =  res.data?.filters;
        setMaterialTableFilters(filters);
      }
    };
    const isActive =
      activeFilter === EMaterialActiveFilter.ACTIVE
        ? true
        : activeFilter === EMaterialActiveFilter.INACTIVE
        ? false
        : null;
    if(isAdmin){
      const data = await getMaterialCategoryDataApi(callApi, callBack, {
        materialKey: materialType,
        categoryKey: materialCategory,
        pageNumber,
        pageSize,
        customFiltersKeyValueList
      }).catch(e=>{
        
      });
    }else{
       await getPrintHouseMaterialCategoryDataApi(callApi, callBack, {
        materialKey: materialType,
        categoryKey: materialCategory,
        supplierId,
        pageNumber,
        pageSize,
        isActive, 
         customFiltersKeyValueList
      }).catch(e=>{
         setMaterialCategoryData([])
         setPagesCount(0);
         setMaterialTableFilters([])
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
