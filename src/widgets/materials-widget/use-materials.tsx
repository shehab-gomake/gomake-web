import {useRouter} from "next/router";
import {useCallback , useMemo, useState} from "react";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {
    deleteMaterialCategoryApi,
    getMaterialCategoriesApi,
    getMaterialCategoryDataApi, getMaterialExcelFileApi,
    getMaterialTableHeadersApi, uploadMaterialExcelFileApi
} from "@/services/api-service/materials/materials-endpoints";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";
import {TableCellData} from "@/widgets/materials-widget/components/table-cell-data/table-cell";
import {Checkbox, IconButton} from "@mui/material";
import {getCurrencies} from "@/services/api-service/general/enums";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
    activeFilterState,
    currenciesState, filterState, flagState, materialActionState,
    materialCategoriesState,
    materialCategoryDataState,
    materialCategorySuppliersState,
    materialHeadersState, selectedSupplierIdState
} from "@/widgets/materials-widget/state";
import {getMaterialSuppliersApi} from "@/services/api-service/materials/materials-suppliers-endpoints";
import {useFilteredMaterials} from "@/widgets/materials-widget/use-filtered-materials";
import { EMaterialActiveFilter } from "./enums";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useMaterials = () => {
    const {query, push, replace} = useRouter();
    const {materialType, materialCategory} = query;
    const [materialHeaders, setMaterialHeaders] = useRecoilState<{ key: string, value: string }[]>(materialHeadersState);
    const [materialCategories, setMaterialCategories] = useRecoilState<{ categoryKey: string, categoryName: string , isAddedByPrintHouse : boolean }[]>(materialCategoriesState)
    const [materialCategoryData, setMaterialCategoryData] = useRecoilState<IMaterialCategoryRow[]>(materialCategoryDataState)
    const setMaterialCategorySuppliers = useSetRecoilState(materialCategorySuppliersState);
    const setMaterialActions = useSetRecoilState(materialActionState);
    const setDefaultSupplier = useSetRecoilState(selectedSupplierIdState);
    const activeFilter = useRecoilValue(activeFilterState);
    const materialFilter = useRecoilValue(filterState);
    const {callApi} = useGomakeAxios();
    const {alertSuccessDelete , alertFaultDelete} = useSnackBar();
    const setCurrencies = useSetRecoilState(currenciesState);
    const {getFilteredMaterials} = useFilteredMaterials()
    const setActiveFilter = useSetRecoilState(activeFilterState);
    const setFlagState = useSetRecoilState(flagState);
    const { errorColor } = useGomakeTheme();

    const onSelectCategory = (category: string) => {
        //setDefaultSupplier('')
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

    const getMaterialCategoryData = async (materialType: string, materialCategory: string, supplierId: string) => {
        const callBack = (res) => {
            if (res.success) {
               setMaterialCategoryData(res.data?.map(row => ({...row, checked: false})));
               res.data?.every(row => !row.isActive) ? setActiveFilter(EMaterialActiveFilter.ALL) :setActiveFilter(EMaterialActiveFilter.ACTIVE) 
            }
        }
        await getMaterialCategoryDataApi(callApi, callBack, {
            materialKey: materialType,
            categoryKey: materialCategory,
            supplierId
        })
    }

    const materialsCategoriesList = useCallback(() => {
        return materialCategories.map(category => ({text: category.categoryName, value: category.categoryKey , icon: category.isAddedByPrintHouse ? ()=> <IconButton onClick={()=>onDeleteCategory(category?.categoryKey)}>
            <DeleteOutlineIcon style={{color: errorColor(500)}} />
          </IconButton> : null}))
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

/////////////////////////////////////////////////////////////////////////////////////////////////////
const [dataRow2, setDataRow] = useState([]);

// const addEmptyRow = () =>{
//     var temp = [...dataRow2];
//     const newIndex = temp.length + 1;
//     const newId = `row_${newIndex}`;
//     const rowData=  {
//         "manufacturer": {
//           "value": null,
//           "isEditable": true,
//           "type": 0
//         },
//         "volume (Liter)": {
//           "value": null,
//           "isEditable": true,
//           "type": 1
//         },
//         "literInSquareMeter": {
//           "value": null,
//           "isEditable": true,
//           "type": 0
//         },
//         "pricePerSquareMeter": {
//           "value": [
//             null,
//             null
//           ],
//           "isEditable": true,
//           "type": 3
//         },
//         "currency": {
//           "value": "usd",
//           "isEditable": true,
//           "type": 5
//         },
//         "stock": {
//           "value": null,
//           "isEditable": true,
//           "type": 1
//         },
//         "Active": {
//           "value": false,
//           "isEditable": true,
//           "type": 2
//         }}
//     temp.push({ 
//         index: newIndex,
//         id: newId,
//         checked: false,
//         rowData:rowData
//     });
//     setDataRow(temp);
//     console.log(temp)
// }


// const deleteRow = (index) => {
//     var temp = [...dataRow2];
//     temp = temp.filter(x => x.index != index);
//     temp.forEach((user, i) => {
//       if (user.index > index) {
//         user.index -= 1;
//       }
//     });
//     setDataRow(temp);
//     console.log(temp)
//   }
    // const dataRow1 = [{
    //     index:0,
    //     id: "emptyRow",
    //     checked: false,
    //     rowData: {
    //         "manufacturer": {
    //           "value": null,
    //           "isEditable": true,
    //           "type": 0
    //         },
    //         "volume (Liter)": {
    //           "value": null,
    //           "isEditable": true,
    //           "type": 1
    //         },
    //         "literInSquareMeter": {
    //           "value": null,
    //           "isEditable": true,
    //           "type": 0
    //         },
    //         "pricePerSquareMeter": {
    //           "value": [
    //             null,
    //             null
    //           ],
    //           "isEditable": true,
    //           "type": 3
    //         },
    //         "currency": {
    //           "value": "usd",
    //           "isEditable": true,
    //           "type": 5
    //         },
    //         "stock": {
    //           "value": null,
    //           "isEditable": true,
    //           "type": 1
    //         },
    //         "Active": {
    //           "value": false,
    //           "isEditable": true,
    //           "type": 2
    //         }
    //       },
    // }];



    const tableRowsTest = useMemo(() => {
        return dataRow2?.map((dataRow) => {
            return [<Checkbox onChange={() => onChangeRowCheckBox(dataRow.id)}
                              checked={dataRow.checked}/>, ...materialHeaders.map(header =>
                <TableCellData {...dataRow.rowData[header.key]} id={dataRow.id} parameterKey={header.key}/>)]
        })
    }, [materialHeaders, materialCategoryData, activeFilter, materialFilter , dataRow2])

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
        uploadExcelFile,
        tableRowsTest,
        dataRow2
    }
}

export {useMaterials}