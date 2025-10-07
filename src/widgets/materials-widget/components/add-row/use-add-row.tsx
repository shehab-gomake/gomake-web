import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { filterState, openAddRowModalState, selectedSupplierIdState } from "../../state";
import { useMaterialsCategories } from "../../use-materials-categories";
import {
    addPrintHouseMaterialCategoryRowApi,
    addPrintHouseMaterialRowApi,
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import { addMaterialCategoryRowApi, deleteMaterialCategoryRowApi, deletePrintHouseMaterialRowApi } from "@/services/api-service/materials/materials-endpoints";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useAddCategoryRow = (isAdmin: boolean) => {
    const { callApi } = useGomakeAxios();
    const { query } = useRouter();
    const { materialType, materialCategory, connectionID } = query;
    const [rowData, setRowData] = useState<any>({});
    const { alertSuccessAdded, alertFaultAdded, alertSuccessDelete, alertFaultDelete, alertFault } = useSnackBar();
    const supplierId = useRecoilValue(selectedSupplierIdState)
    const setOpenModal = useSetRecoilState<boolean>(openAddRowModalState);
    const { getMaterialCategoryData } = useMaterialsCategories(isAdmin);
    const materialFilter = useRecoilValue(filterState);
    const { t } = useTranslation();

    const onAddCategoryRow = async (dataRow) => {
        const stringifiedDataRow = Object.fromEntries(
            Object.entries(dataRow).map(([key, value]) => {
                // Check if the value is an array
                if (Array.isArray(value)) {
                    return [key, value]; // Keep arrays as-is
                }
                // For all other values, convert to string
                return [key, String(value)];
            })
        );

        const callBack = (res) => {
            const error = res?.errors;
            let userMessage = t("materials.inputs.duplicateFailedTryAgain"); // default fallback

            console.log("reaaaaaaaaaaaaaas", res);
            if (res.success) {
                alertSuccessAdded();
                setOpenModal(false);
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), [], supplierId).then();
                setRowData({})
            } else {
                if (res?.statusCode === 2627) {
                    if (error?.errorParams?.length > 0) {
                        const duplicateFields = error?.errorParams
                            ?.map(p => p.key)
                            ?.filter(Boolean)
                            ?.join(", ");
                        userMessage = t("materials.inputs.duplicateDuplicateFields", { fields: duplicateFields });
                    }
                    else if (error?.ErrorMessage) {
                        userMessage = error.ErrorMessage;
                    }

                    alertFault(userMessage);

                }
                else {
                    alertFaultAdded();
                }
            }
        }
        if (isAdmin) {
            await addMaterialCategoryRowApi(callApi, callBack, {
                materialKey: materialType,
                categoryKey: materialCategory,
                rowData: stringifiedDataRow
            })
        } else {
            await addPrintHouseMaterialRowApi(callApi, callBack, {
                materialKey: materialType,
                categoryKey: materialCategory,
                supplierId: supplierId === "" ? undefined : supplierId ?? undefined,
                rowData: stringifiedDataRow,
                ...(connectionID && { connectionId: connectionID })
            })
        }
    }

    const onDeleteCategoryRow = async (id: string) => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessDelete();
                getMaterialCategoryData(materialType?.toString(), materialCategory?.toString(), materialFilter, supplierId).then();
            } else {
                alertFaultDelete();
            }
        }
        if (isAdmin) {
            await deleteMaterialCategoryRowApi(callApi, callBack, { rowId: id })
        } else {
            await deletePrintHouseMaterialRowApi(callApi, callBack, id)
        }
    }

    return {
        onAddCategoryRow,
        onDeleteCategoryRow,
        rowData, setRowData
    }
}

export { useAddCategoryRow }