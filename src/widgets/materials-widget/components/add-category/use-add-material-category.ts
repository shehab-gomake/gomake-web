import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeFilterState, flagState, openAddCategoryModalState } from "@/widgets/materials-widget/state";
import { useMaterials } from "../../use-materials";
import { useState } from "react";
import { EMaterialActiveFilter } from "../../enums";
import { useTranslation } from "react-i18next";
import {addPrintHouseMaterialCategoryApi} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {addMaterialCategoryApi} from "@/services/api-service/materials/materials-endpoints";

const useAddMaterialCategory = (isAdmin:boolean) => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType } = query;
    const { alertSuccessAdded, alertFaultAdded,alertFault } = useSnackBar();
    const [openModal, setOpenModal] = useRecoilState(openAddCategoryModalState);
    const { getMaterialCategories } = useMaterials(isAdmin);
    const [newCategory, setNewCategory] = useState<string>(null);
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setFlagState = useSetRecoilState(flagState);
    const { t } = useTranslation();

    const onSetCategory = (e) => {
        setNewCategory(e.target.value);
    }
    const onAddCategory = async () => {
        if(newCategory){
            const callBack = (res) => {
                if (res.success) {
                    alertSuccessAdded();
                    setActiveFilter(EMaterialActiveFilter.ALL);
                    getMaterialCategories(materialType).then();
                    setOpenModal(false);
                    setFlagState(false);
                } else {
                    alertFaultAdded();
                }
            }
            if(isAdmin){
                await addMaterialCategoryApi(callApi, callBack, {
                    materialTypeKey: materialType.toString(),
                    categoryKey: newCategory
                })
            }else{
                await addPrintHouseMaterialCategoryApi(callApi, callBack, {
                    materialTypeKey: materialType.toString(),
                    categoryKey: newCategory
                })
            }
        }
        else {
            alertFault("login.thisFieldRequired")
        }
       
    }

    return {
        openModal,
        setOpenModal,
        onAddCategory,
        onSetCategory,
        t,
    }
}

export { useAddMaterialCategory }