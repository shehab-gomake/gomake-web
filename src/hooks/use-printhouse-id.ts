import {goMakeClientPrintHouseId} from "@/services/api-request";
import { updatePrintHouseIdHost} from "@/services/storage-data";

const usePrintHouseId = () => {
    const getPrintHouseId = async (code: string): Promise<boolean> => {
        const res = await goMakeClientPrintHouseId("GET", code);
        const {printHouseId, host} = res?.data
        if (printHouseId && host) {
           updatePrintHouseIdHost(printHouseId, host);
            return true;
        }
        return false;
    }
    return {
        getPrintHouseId
    }
}

export {usePrintHouseId}