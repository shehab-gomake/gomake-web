import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { addMaterialCategoryRowApi, deleteMaterialCategoryRowApi } from "@/services/api-service/materials/materials-endpoints";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { openAddRowModalState, selectedSupplierIdState } from "../../state";
import { useMaterials } from "../../use-materials";

const useAddCategoryRow = () => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const { alertSuccessAdded, alertFaultAdded ,alertSuccessDelete,alertFaultDelete} = useSnackBar();
    //const { getMaterialCategoryData} = useMaterials();
    const supplierId = useRecoilValue(selectedSupplierIdState)
    const setOpenModal = useSetRecoilState<boolean>(openAddRowModalState);

    const onAddCategoryRow = async (dataRow) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
                setOpenModal(false);
               // getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), supplierId).then();

            } else {
                alertFaultAdded();
            }
        }
        await addMaterialCategoryRowApi(callApi, callBack, {
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
            } else {
                alertFaultAdded();
            }
        }
        await deleteMaterialCategoryRowApi(callApi, callBack, {rowId: id})
    }

    return {
        onAddCategoryRow,
        onDeleteCategoryRow
    }
}

export { useAddCategoryRow }