import {useRecoilState} from "recoil";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";
import {materialCategoryDataState} from "@/widgets/materials-widget/state";
import {useState} from "react";
import {EMaterialsActions} from "@/widgets/materials-widget/enums";
import {updateMaterialsPropApi} from "@/services/api-service/materials/materials-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {useFilteredMaterials} from "@/widgets/materials-widget/use-filtered-materials";

const useMaterialsActions = () => {
    const {callApi} = useGomakeAxios();
    const {query} = useRouter();
    const {materialType, materialCategory} = query;
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState<IMaterialCategoryRow[]>(materialCategoryDataState);
    const [action, setAction] = useState<{ action: EMaterialsActions, key: string } | null>(null);
    const [updatedValue, setUpdatedValue] = useState<string>('');
    const {setSnackbarStateValue} = useSnackBar();
    const {t} = useTranslation();
    const {getFilteredMaterials} = useFilteredMaterials();

    const getSelectedMaterialsIds = () => getFilteredMaterials().filter(row => row.checked).map(row => row.id);
    const onChooseAction = async (action: { action: EMaterialsActions, key: string } | null) => {
        if (getSelectedMaterialsIds().length === 0) {
            setSnackbarStateValue({
                state: true,
                message: t("modal.noMaterialsSelected"),
                type: "error",
            })
            return;
        }
        if (action?.action === EMaterialsActions.UpdateIsActive || action?.action === EMaterialsActions.UpdateIsInActive) {
            await updateStatus(action?.action)
            return;
        }
        setAction(action);
    }

    const onTextInputChange = (v: string) => {
        setUpdatedValue(v);
    }

    const onUpdate = async () => {
        if (action !== null) {
            await updateMaterialsPropApi(callApi, onUpdateCallBack, {
                materialTypeKey: materialType.toString(),
                categoryKey: materialCategory.toString(),
                ids: getSelectedMaterialsIds(),
                action: action.action,
                priceIndex: 0,
                updatedValue
            })
        }
    }

    const onUpdateCallBack = (res) => {
        if (res.success) {
            setMaterialCategoryData(materialCategoryData.map(material => material.checked ?
                {...material, ...res.data?.find(row => row.id === material.id)}
                : material))
        }
        setAction(null)
        setUpdatedValue('')
    }
    const updateStatus = async (eAction: EMaterialsActions) => {
        await updateMaterialsPropApi(callApi, onUpdateCallBack, {
            materialTypeKey: materialType.toString(),
            categoryKey: materialCategory.toString(),
            ids: getSelectedMaterialsIds(),
            action: eAction,
            priceIndex: 0,
        })
    }
    return {
        getSelectedMaterialsIds,
        onChooseAction,
        action,
        updatedValue,
        onTextInputChange,
        onUpdate
    }
}

export {useMaterialsActions}