import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { addMaterialCategoryRowApi } from "@/services/api-service/materials/materials-endpoints";

const useAddCategoryRow = () => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType, materialCategory } = query;
    const { alertSuccessAdded, alertFaultAdded } = useSnackBar();

    const onAddCategoryRow = async (dataRow) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessAdded();
            } else {
                alertFaultAdded();
            }
        }
        await addMaterialCategoryRowApi(callApi, callBack, {
            materialKey: materialType,
            categoryKey: materialCategory,
            rowData: dataRow
        })
    }

    return { onAddCategoryRow }
}

export { useAddCategoryRow }