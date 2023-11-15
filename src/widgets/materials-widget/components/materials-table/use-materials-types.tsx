import {useCallback, useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {getMaterialsTypesApi} from "@/services/api-service/materials/materials-endpoints";
import {PrimaryButton} from "@/components/button/primary-button";
import {EditIcon} from "@/components/icons/edit-icon";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useMaterialsTypes = () => {
    const {callApi} = useGomakeAxios();
    const [filter, setFilter] = useState<string>("");
    const [materialsTypes, setMaterialsTypes] = useState<{ materialTypeKey: string; materialTypeName: string }[]>([]);
    const {t} = useTranslation();
    const {primaryColor} = useGomakeTheme();

    const onFilterChange = (e) => setFilter(e)
    const getAllMaterials = async () => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialsTypes(res.data)
            }
        }
        await getMaterialsTypesApi(callApi, callBack)
    }

    const getTableRows = useCallback(() => {
        const materials = !!filter ?
            materialsTypes.filter(material => material.materialTypeName.toLowerCase().includes(filter.toLowerCase()))
            : materialsTypes;
        return materials.map((material) => [
            <>{material.materialTypeName}</>,
            <PrimaryButton
                startIcon={<EditIcon color={primaryColor(500)} width={20} height={20}/>}
                href={`/materials/${material.materialTypeKey}`}
                variant={"text"}
            >
                {t('machineAttributes.edit')}
            </PrimaryButton>,
        ]);
    }, [materialsTypes, filter])
    return {
        getAllMaterials,
        getTableRows,
        onFilterChange
    }
}

export {useMaterialsTypes}