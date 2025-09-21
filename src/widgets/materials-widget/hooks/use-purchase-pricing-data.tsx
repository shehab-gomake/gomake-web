import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    purchasePricingDataState,
    isLoadingPurchasePricingState
} from "../state";
import { getPurchasePricingApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const usePurchasePricingData = () => {
    const { callApi } = useGomakeAxios();
    const [purchasePricingData, setPurchasePricingData] = useRecoilState(purchasePricingDataState);
    const setIsLoadingPurchasePricing = useSetRecoilState(isLoadingPurchasePricingState);

    const fetchPurchasePricingData = async (printHouseMaterialId: string) => {
        setIsLoadingPurchasePricing(true);

        const callBack = (res: any) => {
            setIsLoadingPurchasePricing(false);
            if (res.success) {
                setPurchasePricingData(res.data || []);
            } else {
                setPurchasePricingData([]);
            }
        };

        try {
            await getPurchasePricingApi(callApi, callBack, printHouseMaterialId);
        } catch (error) {
            setIsLoadingPurchasePricing(false);
            setPurchasePricingData([]);
            console.error("Error fetching purchase pricing data:", error);
        }
    };

    const clearPurchasePricingData = () => {
        setPurchasePricingData([]);
    };

    return {
        purchasePricingData,
        fetchPurchasePricingData,
        clearPurchasePricingData,
    };
};

export { usePurchasePricingData };
