import { useCallback, useEffect, useState } from "react";
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
import { EFilterStatus } from "./materials-table";

const useMaterialsTypes = (isAdmin: boolean) => {
    const { callApi } = useGomakeAxios();
    const [filter, setFilter] = useState<string>("");
    const [materialsTypes, setMaterialsTypes] = useState<{ materialTypeKey: string; materialTypeName: string; isActive: boolean }[]>([]);
    const { t } = useTranslation();
    const { primaryColor } = useGomakeTheme();
    const tableHeaders = [t("materials.materialsType"), t("materials.edit"), t("properties.more")];
    const [filterStatus, setFilterStatus] = useState<{
        label: string;
        value: EFilterStatus;
    }>({
        label: "All",
        value: EFilterStatus.All,
    });

    const filterStatusList = [
        {
            label: "All",
            value: EFilterStatus.All,
        },
        {
            label: "Active",
            value: EFilterStatus.Active,
        },
        {
            label: "Inactive",
            value: EFilterStatus.Inactive,
        },
    ];
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        getAllMaterials().then();
    }, []);
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

        const filteredMaterials = materialsTypes.filter(material => {
            const matchesFilter = !filter || material.materialTypeName.toLowerCase().includes(filter.toLowerCase());
            const matchesStatus = filterStatus.value === EFilterStatus.All ||
                (filterStatus.value === EFilterStatus.Active && material.isActive) ||
                (filterStatus.value === EFilterStatus.Inactive && !material.isActive);

            return matchesFilter && matchesStatus;
        });

        // const materials = !!filter ?
        //     materialsTypes.filter(material => material.materialTypeName.toLowerCase().includes(filter.toLowerCase()))
        //     : materialsTypes;
        return filteredMaterials.map((material) => [
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
    }, [materialsTypes, filter, filterStatus])
    return {
        getTableRows,
        onFilterChange,
        handleCloseMoreMenu,
        setFilterStatus,
        handleClick,
        handleClose,
        getAllMaterials,
        anchorElMenuTable,
        selectedMaterial,
        filterStatus,
        filterStatusList,
        tableHeaders,
        anchorEl,
        open,
    }
}

export { useMaterialsTypes }