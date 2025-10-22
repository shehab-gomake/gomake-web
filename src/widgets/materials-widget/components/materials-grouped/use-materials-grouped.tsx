import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getGroupedMaterialTypesApi, toggleMaterialTypeActiveApi } from "@/services/api-service/materials/materials-endpoints";
import { useTranslation } from "react-i18next";

export interface MaterialType {
    materialTypeKey: string;
    materialType_CategoryKey: string | null;
    pricingModel: number;
    materialTypeName: string;
    enumCode: string;
    isCanUploadImage: boolean | null;
    tableHeaders: any | null;
    actions: any | null;
    isActive: boolean;
}

export interface MaterialCategory {
    categoryKey: string | null;
    categoryColor?: string;
    data: MaterialType[];
}

export enum EFilterStatus {
    All,
    Active,
    Inactive,
}

const useMaterialsGrouped = (isAdmin: boolean) => {
    const { callApi } = useGomakeAxios();
    const { t } = useTranslation();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

    const [filter, setFilter] = useState<string>("");
    const [materialsCategories, setMaterialsCategories] = useState<MaterialCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const filterStatusList = useMemo(
        () => [
            {
                label: t("navigationButtons.all"),
                value: EFilterStatus.All,
            },
            {
                label: t("navigationButtons.active"),
                value: EFilterStatus.Active,
            },
            {
                label: t("navigationButtons.inactive"),
                value: EFilterStatus.Inactive,
            },
        ],
        [t]
    );

    const [filterStatus, setFilterStatus] = useState<{
        label: string;
        value: EFilterStatus;
    }>(filterStatusList[1]);

    useEffect(() => {
        setFilterStatus(filterStatusList[1]);
    }, [filterStatusList]);

    const getAllGroupedMaterials = async () => {
        setLoading(true);
        const callBack = (res) => {
            if (res.success) {
                setMaterialsCategories(res.data);
            }
            setLoading(false);
        };
        await getGroupedMaterialTypesApi(callApi, callBack);
    };

    const toggleMaterialTypeActive = async (materialTypeKey: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
                getAllGroupedMaterials();
            } else {
                alertFaultUpdate();
            }
        };
        await toggleMaterialTypeActiveApi(callApi, callBack, {
            key: materialTypeKey,
        });
    };

    const onFilterChange = (e: string) => setFilter(e);

    const filteredCategories = useMemo(() => {
        return materialsCategories.map(category => ({
            ...category,
            data: category.data.filter(material => {
                const matchesFilter = !filter ||
                    material.materialTypeName.toLowerCase().includes(filter.toLowerCase());
                const matchesStatus =
                    filterStatus.value === EFilterStatus.All ||
                    (filterStatus.value === EFilterStatus.Active && material.isActive) ||
                    (filterStatus.value === EFilterStatus.Inactive && !material.isActive);

                return matchesFilter && matchesStatus;
            })
        })).filter(category => category.data.length > 0);
    }, [materialsCategories, filter, filterStatus]);

    const allMaterials = useMemo(() => {
        return materialsCategories.flatMap(category => category.data);
    }, [materialsCategories]);

    useEffect(() => {
        getAllGroupedMaterials();
    }, []);

    return {
        t,
        categoriesWithMaterials: filteredCategories,
        allMaterials,
        onFilterChange,
        loading,
        filter,
        filterStatus,
        setFilterStatus,
        filterStatusList,
        toggleMaterialTypeActive,
        refreshMaterials: getAllGroupedMaterials,
    };
};

export { useMaterialsGrouped };
