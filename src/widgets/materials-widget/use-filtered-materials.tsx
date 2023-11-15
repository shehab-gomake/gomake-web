import {useCallback} from "react";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";
import {useRecoilValue} from "recoil";
import {
    activeFilterState, filterState,
    materialCategoryDataState,
} from "@/widgets/materials-widget/state";
import {EMaterialActiveFilter} from "@/widgets/materials-widget/enums";

const useFilteredMaterials = () => {
    const materialCategoryData = useRecoilValue<IMaterialCategoryRow[]>(materialCategoryDataState)
    const activeFilter = useRecoilValue(activeFilterState);
    const materialFilter = useRecoilValue(filterState);



    const getFilteredMaterials = useCallback(() => {
        const FAMaterials = activeFilter === EMaterialActiveFilter.ALL ? materialCategoryData : materialCategoryData
            ?.filter((material) => activeFilter === EMaterialActiveFilter.ACTIVE ? material.isActive : !material.isActive);
        return materialFilter === null ? FAMaterials : FAMaterials?.filter(material => material.rowData[materialFilter.key].value === materialFilter.value)
    }, [activeFilter, materialCategoryData, materialFilter])

    return {
        getFilteredMaterials
    }
}

export {useFilteredMaterials}