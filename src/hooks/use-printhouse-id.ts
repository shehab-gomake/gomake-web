import {goMakeClientPrintHouseId} from "@/services/api-request";
import {setItem} from "@/services/storage-data";

const usePrintHouseId = () => {
    const getPrintHouseId = async (code: string): Promise<boolean> => {
        const printHouseId = await goMakeClientPrintHouseId("GET", code);
        if (printHouseId?.data) {
            setItem("printhouseid", printHouseId.data);
            return true;
        }
        return false;
    }
    return {
        getPrintHouseId
    }
}

export {usePrintHouseId}