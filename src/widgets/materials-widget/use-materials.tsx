import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
    deleteMaterialCategoryApi,
    getMaterialCategoriesApi,
    getMaterialCategoryDataApi, getMaterialExcelFileApi,
    getMaterialTableHeadersApi, uploadMaterialExcelFileApi
} from "@/services/api-service/materials/materials-endpoints";
import { IMaterialCategoryRow } from "@/widgets/materials-widget/interface";
import { TableCellData } from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import { Checkbox, IconButton, Tooltip } from "@mui/material";
import { getCurrencies } from "@/services/api-service/general/enums";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
    activeFilterState,
    currenciesState, filterState, flagState, materialActionState,
    materialCategoriesState,
    materialCategoryDataState,
    materialCategorySuppliersState,
    materialHeadersState, openAddRowModalState, selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import { getMaterialSuppliersApi } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { useFilteredMaterials } from "@/widgets/materials-widget/use-filtered-materials";
import { EMaterialActiveFilter } from "./enums";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import { useTranslation } from "react-i18next";
import { useAddCategoryRow } from "./components/add-row/use-add-row";
import { WastebasketNew } from "@/icons/wastebasket-new";
import { Wastebasket } from "@/icons/wastebasket";

const useMaterials = () => {
    const { query, push, replace } = useRouter();
    const { materialType, materialCategory } = query;
    const [materialHeaders, setMaterialHeaders] = useRecoilState<{ key: string, value: string }[]>(materialHeadersState);
    const [materialCategories, setMaterialCategories] = useRecoilState<{ categoryKey: string, categoryName: string, isAddedByPrintHouse: boolean }[]>(materialCategoriesState)
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState<IMaterialCategoryRow[]>(materialCategoryDataState)
    const setMaterialCategorySuppliers = useSetRecoilState(materialCategorySuppliersState);
    const setMaterialActions = useSetRecoilState(materialActionState);
    const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
    const activeFilter = useRecoilValue(activeFilterState);
    const materialFilter = useRecoilValue(filterState);
    const { callApi } = useGomakeAxios();
    const { alertSuccessDelete, alertFaultDelete } = useSnackBar();
    const setCurrencies = useSetRecoilState(currenciesState);
    const setOpenModal = useSetRecoilState<any>(openAddRowModalState);
    const { getFilteredMaterials } = useFilteredMaterials();
    const { onDeleteCategoryRow } = useAddCategoryRow();
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setFlagState = useSetRecoilState(flagState);
    const { primaryColor , errorColor } = useGomakeTheme();
    const { t } = useTranslation();

    const onSelectCategory = (category: string) => {
        setDefaultSupplier('')
        push(`/materials/${materialType}?materialCategory=${category}`)
        setFlagState(false);
    }

    // delete category which is added by PrintHouse
    const onDeleteCategory = async (categoryKey) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessDelete();
                getMaterialCategories(materialType).then();
            } else {
                alertFaultDelete();
            }
        }
        await deleteMaterialCategoryApi(callApi, callBack, {
            materialTypeKey: materialType.toString(),
            categoryKey: categoryKey,
        })
    }

    const getMaterialCategories = async (material) => {
        const callBack = (res) => {
            if (res?.success) {
                setMaterialCategories(res?.data);
            } else {
                push('/materials');
            }
        }
        await getMaterialCategoriesApi(callApi, callBack, material)
    }

    const materialsCategoriesList = useCallback(() => {
        return materialCategories.map(category => ({
            text: category.categoryName, value: category.categoryKey, icon: category.isAddedByPrintHouse ? () => <IconButton onClick={() => onDeleteCategory(category?.categoryKey)}>
                <WastebasketNew  width={"30px"} height={"30px"}/>
            </IconButton> : null
        }))
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
        } : { ...row, checked: false }))
    }, [materialCategoryData, getFilteredMaterials(), isAllSelected()])

    const onChangeRowCheckBox = (id: string) => {
        setMaterialCategoryData(materialCategoryData.map(row => id === row.id ? { ...row, checked: !row.checked } : row))
    }

    const tableHeaders = useCallback(() => {
        return [<Checkbox onChange={onChangeHeaderCheckBox}
            checked={isAllSelected()} />, ...materialHeaders.map(header => header.value)];
    }, [materialHeaders, materialCategoryData])


    const tableRows = useMemo(() => {
        return getFilteredMaterials().map((dataRow) => {
            return [<Checkbox onChange={() => onChangeRowCheckBox(dataRow.id)}
                checked={dataRow.checked} />, ...materialHeaders.map(header =>
                    <TableCellData {...dataRow.rowData[header.key]} id={dataRow.id} parameterKey={header.key} />)]
        })
    }, [materialHeaders, materialCategoryData, activeFilter, materialFilter])


    const tableHeadersNew = useCallback(() => {
        return [<Checkbox onChange={onChangeHeaderCheckBox}
            checked={isAllSelected()} />, ...materialHeaders.map(header => header.value), <Tooltip title={t("materials.buttons.addRow")}>
            <IconButton type="button" onClick={() => { setOpenModal(true) }}>
                <AddBoxOutlinedIcon style={{ color: primaryColor(500) }} />
            </IconButton>
        </Tooltip>];
    }, [materialHeaders, materialCategoryData])


    const tableRowsNew = useMemo(() => {
        return getFilteredMaterials().map((dataRow) => {
            return [
                <Checkbox
                    onChange={() => onChangeRowCheckBox(dataRow.id)}
                    checked={dataRow.checked}
                />,
                ...materialHeaders.map(header => (
                    <TableCellData
                        {...dataRow.rowData[header.key]}
                        id={dataRow.id}
                        parameterKey={header.key}
                    />
                )),
                <IconButton onClick={() => onDeleteCategoryRow(dataRow.id)}>
                    <WastebasketNew  width={"30px"} height={"30px"}/>
                </IconButton>,
            ];
        })
    }, [materialHeaders, materialCategoryData, activeFilter, materialFilter]);



    const getCurrenciesApi = async () => {
        const callBack = (res) => {
            if (res.success) {
                setCurrencies(res.data.map(({ value, text }) => ({ label: text, value })))
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
        await getMaterialSuppliersApi(callApi, callBack, { key: materialType, categoryName: materialCategory })
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
                }, { key: materialType.toString(), base64: base64String })
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
        getMaterialTableHeaders,
        getPrintHouseMaterialCategorySuppliers,
        materialCategoryData,
        materialCategories,
        replace,
        downloadExcelFile,
        uploadExcelFile,
        tableHeadersNew,
        tableRowsNew,
    }
}

export { useMaterials }