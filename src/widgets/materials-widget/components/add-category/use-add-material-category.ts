import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeFilterState, flagState, openAddCategoryModalState } from "@/widgets/materials-widget/state";
import { useMaterials } from "../../use-materials";
import { addMaterialCategoryApi } from "@/services/api-service/materials/materials-endpoints";
import { useState } from "react";
import { EMaterialActiveFilter } from "../../enums";
import { useTranslation } from "react-i18next";

const useAddMaterialCategory = () => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType } = query;
    const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
    const [openModal, setOpenModal] = useRecoilState(openAddCategoryModalState);
    const { getMaterialCategories } = useMaterials();
    const [newCategory, setNewCategory] = useState<string>(null);
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setFlagState = useSetRecoilState(flagState);
    const { t } = useTranslation();

    const onSetCategory = (e) => {
        setNewCategory(e.target.value);
    }

    const onAddCategory = async () => {
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
        await addMaterialCategoryApi(callApi, callBack, {
            materialTypeKey: materialType.toString(),
            categoryKey: newCategory
        })
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