import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    inventoryDataState,
    isLoadingInventoryState,
    inventoryTableHeadingUnitsState
} from "../state";
import { getSupplierInventoriesApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const useInventoryData = () => {
    const { callApi } = useGomakeAxios();
    const [inventoryData, setInventoryData] = useRecoilState(inventoryDataState);
    const [inventoryTableHeadingUnits, setInventoryTableHeadingUnits] = useRecoilState(inventoryTableHeadingUnitsState);
    const setIsLoadingInventory = useSetRecoilState(isLoadingInventoryState);

    const fetchInventoryData = async (printHouseMaterialId: string) => {
        setIsLoadingInventory(true);

        const callBack = (res: any) => {
            setIsLoadingInventory(false);
            if (res.success) {
                setInventoryData(res.data?.data || []);
                setInventoryTableHeadingUnits(res.data?.tableHeadingUnits || {});
            } else {
                setInventoryData([]);
                setInventoryTableHeadingUnits({});
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
        inventoryTableHeadingUnits,
        fetchInventoryData,
        clearInventoryData,
    };
};

export { useInventoryData };
