import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValue} from "recoil";
import { openAddRowModalState, selectedSupplierIdState } from "../../state";
import { useMaterialsCategories } from "../../use-materials-categories";
import {
    addPrintHouseMaterialCategoryRowApi,
    deletePrintHouseMaterialCategoryApi
} from "@/services/api-service/materials/printhouse-materials-endpoints";

const useAddCategoryRow = () => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const { alertSuccessAdded, alertFaultAdded, alertSuccessDelete, alertFaultDelete } = useSnackBar();
    const supplierId = useRecoilValue(selectedSupplierIdState)
    const setOpenModal = useSetRecoilState<boolean>(openAddRowModalState);
    const {getMaterialCategoryData} =useMaterialsCategories();


    const onAddCategoryRow = async (dataRow) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
                setOpenModal(false);
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), supplierId).then();
            } else {
                alertFaultAdded();
            }
        }
        await addPrintHouseMaterialCategoryRowApi(callApi, callBack, {
            materialKey: materialType,
            categoryKey: materialCategory,
            supplierId: supplierId,
            rowData: dataRow
        })
    }

    const onDeleteCategoryRow = async (id: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessDelete();
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), supplierId).then();
            } else {
                alertFaultDelete();
            }
        }
        await deletePrintHouseMaterialCategoryApi(callApi, callBack, { rowId: id })
    }

    return {
        onAddCategoryRow,
        onDeleteCategoryRow
    }
}

export { useAddCategoryRow }