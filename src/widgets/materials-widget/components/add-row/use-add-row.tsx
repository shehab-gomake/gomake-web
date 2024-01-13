import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValue} from "recoil";
import {filterState, openAddRowModalState, selectedSupplierIdState} from "../../state";
import { useMaterialsCategories } from "../../use-materials-categories";
import {
    addPrintHouseMaterialCategoryRowApi,
    deletePrintHouseMaterialCategoryRowApi
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {addMaterialCategoryRowApi, deleteMaterialCategoryRowApi} from "@/services/api-service/materials/materials-endpoints";

const useAddCategoryRow = (isAdmin:boolean) => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const { alertSuccessAdded, alertFaultAdded, alertSuccessDelete, alertFaultDelete } = useSnackBar();
    const supplierId = useRecoilValue(selectedSupplierIdState)
    const setOpenModal = useSetRecoilState<boolean>(openAddRowModalState);
    const {getMaterialCategoryData} =useMaterialsCategories(isAdmin);
    const materialFilter = useRecoilValue(filterState);


    const onAddCategoryRow = async (dataRow) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
                setOpenModal(false);
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(),[], supplierId).then();
            } else {
                alertFaultAdded();
            }
        }
        if(isAdmin){
            await addMaterialCategoryRowApi(callApi, callBack, {
                materialKey: materialType,
                categoryKey: materialCategory,
                rowData: dataRow
            })
        }else{
            await addPrintHouseMaterialCategoryRowApi(callApi, callBack, {
                materialKey: materialType,
                categoryKey: materialCategory,
                supplierId: supplierId,
                rowData: dataRow
            })
        }
    }

    const onDeleteCategoryRow = async (id: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessDelete();
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(),materialFilter, supplierId).then();
            } else {
                alertFaultDelete();
            }
        }
        if(isAdmin){
            await deleteMaterialCategoryRowApi(callApi, callBack, { rowId: id })
        }else{
            await deletePrintHouseMaterialCategoryRowApi(callApi, callBack, { rowId: id })
        }
    }

    return {
        onAddCategoryRow,
        onDeleteCategoryRow
    }
}

export { useAddCategoryRow }