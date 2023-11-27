import { useGomakeAxios } from "@/hooks";
import { getMaterialCategoryDataApi } from "@/services/api-service/materials/materials-endpoints";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { useSetRecoilState } from "recoil";
import { activeFilterState, materialCategoryDataState, } from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "./enums";


const useMaterialsCategories = () => {
    const { callApi } = useGomakeAxios();
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setMaterialCategoryData = useSetRecoilState<IMaterialCategoryRow[]>(materialCategoryDataState)

    const getMaterialCategoryData = async (materialType: string, materialCategory: string, supplierId: string) => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialCategoryData(res.data?.map(row => ({ ...row, checked: false })));
                res.data?.every(row => !row.isActive) ? setActiveFilter(EMaterialActiveFilter.ALL) : setActiveFilter(EMaterialActiveFilter.ACTIVE)
            }
        }
        await getMaterialCategoryDataApi(callApi, callBack, {
            materialKey: materialType,
            categoryKey: materialCategory,
            supplierId
        })
    }

    return {
        getMaterialCategoryData
    }
}

export { useMaterialsCategories }