import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    inventoryDataState,
    isLoadingInventoryState
} from "../state";
import { getSupplierInventoriesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const useInventoryData = () => {
    const { callApi } = useGomakeAxios();
    const [inventoryData, setInventoryData] = useRecoilState(inventoryDataState);
    const setIsLoadingInventory = useSetRecoilState(isLoadingInventoryState);

    const fetchInventoryData = async (printHouseMaterialId: string) => {
        setIsLoadingInventory(true);

        const callBack = (res: any) => {
            setIsLoadingInventory(false);
            if (res.success) {
                setInventoryData(res.data || []);
            } else {
                setInventoryData([]);
            }
        };

        try {
            await getSupplierInventoriesApi(callApi, callBack, printHouseMaterialId);
        } catch (error) {
            setIsLoadingInventory(false);
            setInventoryData([]);
            console.error("Error fetching inventory data:", error);
        }
    };

    const clearInventoryData = () => {
        setInventoryData([]);
    };

    return {
        inventoryData,
        fetchInventoryData,
        clearInventoryData,
    };
};

export { useInventoryData };
