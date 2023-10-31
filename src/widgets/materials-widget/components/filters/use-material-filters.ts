import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    activeFilterState, filterState,
    materialCategoryDataState,
    materialCategorySuppliersState,
    materialHeadersState,
    selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import {EFilterType, EMaterialActiveFilter} from "@/widgets/materials-widget/enums";
import {useCallback} from "react";
import {setDefaultSupplierApi} from "@/services/api-service/materials/materials-suppliers-endpoints";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";

const useMaterialFilters = () => {
    const [activeFilter, setActiveFilter] = useRecoilState(activeFilterState);
    const materialHeaders = useRecoilValue(materialHeadersState);
    const [materialSuppliers, setMaterialsSuppliers] = useRecoilState(materialCategorySuppliersState);
    const [supplierId, setSupplierId] = useRecoilState(selectedSupplierIdState);
    const materialData = useRecoilValue(materialCategoryDataState);
    const {alertFaultUpdate, alertSuccessUpdate} = useSnackBar();
    const {query} = useRouter();
    const {materialType, materialCategory} = query;
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const setFilter = useSetRecoilState(filterState)
    const activeFilterOptions = [
        {value: EMaterialActiveFilter.ALL, label: t('materialsStatus.all')},
        {value: EMaterialActiveFilter.ACTIVE, label: t('materialsStatus.active')},
        {value: EMaterialActiveFilter.INACTIVE, label: t('materialsStatus.inactive')},
    ];

    const activeFilterLabel = useCallback(() => {
        const option = activeFilterOptions?.find(({value}) => value === activeFilter);
        return option?.label;
    }, [activeFilter])

    const onActiveFilterChange = (value: any) => {
        setActiveFilter(value);
    }
    const onSelectSupplier = (supplierId: string) => {
        setSupplierId(supplierId);
    }

    const onSetDefaultSupplier = async (supplierId: string) => {
        alert(supplierId)
        const callBack = (res) => {
            if (res.success)  {
                alertSuccessUpdate();
                setMaterialsSuppliers(materialSuppliers.map(supplier => ({...supplier, isDefault: supplier.value === supplierId})))
            }else {
                alertFaultUpdate();
            }
        }
        await setDefaultSupplierApi(callApi, callBack, {
            materialTypeKey: materialType?.toString(),
            categoryKey: materialCategory?.toString(),
            supplierId
        })
    }

    const getFilters = useCallback(() => {
        return materialHeaders?.filter(header => header.isFilter && header.filterType === EFilterType.SELECT).map(header => ({
            key: header.key,
            label: header.value,
            options: Array.from(new Set(materialData.map(material => material.rowData[header.key].value))).map(v => ({value: v, label: v}))
        }))

    }, [materialHeaders, materialData])

    const onChange = (filter: {key: string, value: string} | null) => {
        setFilter(filter)
    }

    return {
        onActiveFilterChange,
        activeFilter,
        activeFilterOptions,
        activeFilterLabel,
        materialSuppliers,
        onSelectSupplier,
        supplierId,
        onSetDefaultSupplier,
        getFilters,
        onChange
    }
}

export {useMaterialFilters}