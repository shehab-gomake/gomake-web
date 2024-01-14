import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    activeFilterState, filterState,
    materialCategoryDataState,
    materialCategorySuppliersState,
    materialHeadersState, materialsTablePageState, materialTableFiltersState,
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
    const materialTableFilters = useRecoilValue(materialTableFiltersState);
    const [materialSuppliers, setMaterialsSuppliers] = useRecoilState(materialCategorySuppliersState);
    const [supplierId, setSupplierId] = useRecoilState(selectedSupplierIdState);
    const materialData = useRecoilValue(materialCategoryDataState);
    const {alertFaultUpdate, alertSuccessUpdate} = useSnackBar();
    const {query} = useRouter();
    const {materialType, materialCategory} = query;
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const [filters,setFilters] = useRecoilState(filterState);
    const [pageNumber, setPageNumber] = useRecoilState(materialsTablePageState);

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
        setPageNumber(1);
    }
    const onSelectSupplier = (supplierId: string) => {
        setSupplierId(supplierId);
    }

    const onSetDefaultSupplier = async (supplierId: string) => {
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
        });
        setPageNumber(1);
    }
    const setFilterValue = (key:string,value:string) => {
        if(!value){
            setFilters(filters.filter(x=>x.key !== key));
        }else{
            setFilters(filters.find(x=>x.key === key ) ? filters.map(x=>{
                if(x.key === key){
                    return {key:key,value:value}
                }
                return x;
            }) : [...filters,{key:key,value:value}]);
        }
        setPageNumber(1);
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
        materialTableFilters,
        setFilterValue,
        
    }
}

export {useMaterialFilters}