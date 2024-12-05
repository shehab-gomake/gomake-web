import { useCallback, useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { getMaterialsTypesApi } from "@/services/api-service/materials/materials-endpoints";
import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/components/icons/edit-icon";
import { useTranslation } from "react-i18next";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { MoreIcon } from "@/components/icons/icons";
import { IconButton } from "@mui/material";

const useMaterialsTypes = (isAdmin: boolean) => {
    const { callApi } = useGomakeAxios();
    const [filter, setFilter] = useState<string>("");
    const [materialsTypes, setMaterialsTypes] = useState<{ materialTypeKey: string; materialTypeName: string }[]>([]);
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const materialsSteps: StepType[] = [
        {
            selector: '[data-tour="materialsTable"]',
            content: 'This is the table displaying all the materials we support.',
            position: 'bottom',

        },
        {
            selector: '[data-tour="sheetMaterialsEdit"]',
            content: 'Please click on "Edit" in the "Sheets" line to explore the functionalities available for managing sheets.',
            position: 'bottom',
        },
    ];
    const { } = useGoMakeTour(materialsSteps, [materialsTypes]);
    const [selectedMaterial, setSelectedMaterial] = useState<{ materialTypeKey: string; materialTypeName: string } | null>(null);
    const [anchorElMenuTable, setAnchorElMenuTable] = useState<null | HTMLElement>(null);
    const handleCloseMoreMenu = () => {
        setAnchorElMenuTable(null);
    };
    const handleOpenMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElMenuTable(event.currentTarget);
    };
    const onFilterChange = (e) => setFilter(e)
    const getAllMaterials = async () => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialsTypes(res.data);
            }
        }
        await getMaterialsTypesApi(callApi, callBack)
    }

    const getTableRows = useCallback(() => {
        const basePath = isAdmin ? '/materials-admin' : '/materials'

        const materials = !!filter ?
            materialsTypes.filter(material => material.materialTypeName.toLowerCase().includes(filter.toLowerCase()))
            : materialsTypes;
        return materials.map((material) => [
            <>{material.materialTypeName}</>,
            <PrimaryButton
                data-tour={material.materialTypeKey === 'sheets' ? 'sheetMaterialsEdit' : undefined}
                startIcon={<EditIcon color={primaryColor(500)} width={20} height={20} />}
                href={basePath + `/${material.materialTypeKey}`}
                variant={"text"}
            >
                {t('machineAttributes.edit')}
            </PrimaryButton>,
            <IconButton onClick={(event) => {
                handleOpenMoreMenu(event)
                setSelectedMaterial(material)
            }}>

                <MoreIcon />
            </IconButton>
        ]);
    }, [materialsTypes, filter])
    return {
        getAllMaterials,
        getTableRows,
        onFilterChange,
        handleOpenMoreMenu,
        handleCloseMoreMenu,
        anchorElMenuTable,
        selectedMaterial
    }
}

export { useMaterialsTypes }