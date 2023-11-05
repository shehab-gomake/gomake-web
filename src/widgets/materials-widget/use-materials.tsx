import {useRouter} from "next/router";
import {useCallback, useMemo} from "react";
import {useGomakeAxios} from "@/hooks";
import {
    getMaterialCategoriesApi,
    getMaterialCategoryDataApi, getMaterialExcelFileApi,
    getMaterialTableHeadersApi, uploadMaterialExcelFileApi
} from "@/services/api-service/materials/materials-endpoints";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";
import {TableCellData} from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import {Checkbox} from "@mui/material";
import {getCurrencies} from "@/services/api-service/general/enums";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    activeFilterState,
    currenciesState, filterState, materialActionState,
    materialCategoriesState,
    materialCategoryDataState,
    materialCategorySuppliersState,
    materialHeadersState, selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import {getMaterialSuppliersApi} from "@/services/api-service/materials/materials-suppliers-endpoints";
import {useFilteredMaterials} from "@/widgets/materials-widget/use-filtered-materials";

const useMaterials = () => {
    const {query, push, replace} = useRouter();
    const {materialType, materialCategory} = query;
    const [materialHeaders, setMaterialHeaders] = useRecoilState<{ key: string, value: string }[]>(materialHeadersState);
    const [materialCategories, setMaterialCategories] = useRecoilState<{ categoryKey: string, categoryName: string }[]>(materialCategoriesState)
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState<IMaterialCategoryRow[]>(materialCategoryDataState)
    const setMaterialCategorySuppliers = useSetRecoilState(materialCategorySuppliersState);
    const setMaterialActions = useSetRecoilState(materialActionState);
    const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
    const activeFilter = useRecoilValue(activeFilterState);
    const materialFilter = useRecoilValue(filterState);
    const {callApi} = useGomakeAxios();
    const setCurrencies = useSetRecoilState(currenciesState);
    const {getFilteredMaterials} = useFilteredMaterials()

    const onSelectCategory = (category: string) => {
        setDefaultSupplier('')
        push(`/materials/${materialType}?materialCategory=${category}`)
    }
    const getMaterialCategories = async (material) => {
        const callBack = (res) => {
            if (res?.success) {
                if (res.data.length === 0) {
                    push('/materials');
                    return;
                }
                setMaterialCategories(res?.data);
            } else {
                push('/materials');
            }
        }
        await getMaterialCategoriesApi(callApi, callBack, material)
    }
    const getMaterialCategoryData = async (materialType: string, materialCategory: string, supplierId: string) => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialCategoryData(res.data?.map(row => ({...row, checked: false})));
            }
        }
        await getMaterialCategoryDataApi(callApi, callBack, {
            materialKey: materialType,
            categoryKey: materialCategory,
            supplierId
        })
    }
    const materialsCategoriesList = useCallback(() => {
        return materialCategories.map(category => ({text: category.categoryName, value: category.categoryKey}))
    }, [materialCategories])


    const getMaterialTableHeaders = async (materialType: string) => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialHeaders(res.data?.tableHeaders);
                setMaterialActions(res.data?.actions);
            }
        }
        await getMaterialTableHeadersApi(callApi, callBack, materialType)
    }

    const isAllSelected = useCallback(() => {
        return getFilteredMaterials().every(row => row.checked)
    }, [materialCategoryData])


    const onChangeHeaderCheckBox = useCallback(() => {
        const checked = isAllSelected();
        const materialsIds = getFilteredMaterials().map(material => material.id);
        setMaterialCategoryData(materialCategoryData.map(row => materialsIds.includes(row.id) ? {
            ...row,
            checked: !checked
        } : {...row, checked: false}))
    }, [materialCategoryData, getFilteredMaterials(), isAllSelected()])

    const onChangeRowCheckBox = (id: string) => {
        setMaterialCategoryData(materialCategoryData.map(row => id === row.id ? {...row, checked: !row.checked} : row))
    }

    const tableHeaders = useCallback(() => {
        return [<Checkbox onChange={onChangeHeaderCheckBox}
                          checked={isAllSelected()}/>, ...materialHeaders.map(header => header.value)];
    }, [materialHeaders, materialCategoryData])


    const tableRows = useMemo(() => {
        return getFilteredMaterials().map((dataRow) => {
            return [<Checkbox onChange={() => onChangeRowCheckBox(dataRow.id)}
                              checked={dataRow.checked}/>, ...materialHeaders.map(header =>
                <TableCellData {...dataRow.rowData[header.key]} id={dataRow.id} parameterKey={header.key}/>)]
        })
    }, [materialHeaders, materialCategoryData, activeFilter, materialFilter])

    const getCurrenciesApi = async () => {
        const callBack = (res) => {
            if (res.success) {
                setCurrencies(res.data.map(({value, text}) => ({label: text, value})))
            }
        }
        await getCurrencies(callApi, callBack)
    }

    const getPrintHouseMaterialCategorySuppliers = async (materialType: string, materialCategory: string) => {
        const callBack = (res) => {
            if (res.success) {
                setMaterialCategorySuppliers(res?.data?.map(supplier => {
                    if (supplier.isDefault) {
                        setDefaultSupplier(supplier.id)
                    }
                    return {
                        isDefault: supplier.isDefault,
                        value: supplier.id,
                        label: supplier.name
                    }
                }));
            }
        }
        await getMaterialSuppliersApi(callApi, callBack, {key: materialType, categoryName: materialCategory})
    }

    const downloadExcelFile = async () => {
        const callBack = (res) => {
            if (res.success) {
                const downloadLink = document.createElement('a');
                downloadLink.href = res.data; // Use the provided file URL
                downloadLink.download = materialType + '.xlsx'; // Replace with the desired file name
                downloadLink.click();
            }
        }
        await getMaterialExcelFileApi(callApi, callBack, materialType)
    }

    const uploadExcelFile = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const arrayBuffer = event.target.result;
                const data = new Uint8Array(arrayBuffer as ArrayBuffer);

                // Convert data to a Base64 string
                const base64String = btoa(String.fromCharCode.apply(null, data));
                uploadMaterialExcelFileApi(callApi, () => {
                }, {key: materialType.toString(), base64: base64String})
            };
            reader.readAsArrayBuffer(file)
        }
    }

    return {
        materialCategory,
        materialType,
        materialsCategoriesList,
        onSelectCategory,
        tableHeaders,
        tableRows,
        getCurrenciesApi,
        getMaterialCategories,
        getMaterialCategoryData,
        getMaterialTableHeaders,
        getPrintHouseMaterialCategorySuppliers,
        materialCategoryData,
        materialCategories,
        replace,
        downloadExcelFile,
        uploadExcelFile
    }
}

export {useMaterials}