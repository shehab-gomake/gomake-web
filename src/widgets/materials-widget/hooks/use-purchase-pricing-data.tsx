import { useGomakeAxios } from "@/hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
    purchasePricingDataState,
    isLoadingPurchasePricingState,
    purchasePricingTableHeadingUnitsState
} from "../state";
import { getPurchasePricingApi } from "@/services/api-service/materials/printhouse-materials-endpoints";

const usePurchasePricingData = () => {
    const { callApi } = useGomakeAxios();
    const [purchasePricingData, setPurchasePricingData] = useRecoilState(purchasePricingDataState);
    const [purchasePricingTableHeadingUnits, setPurchasePricingTableHeadingUnits] = useRecoilState(purchasePricingTableHeadingUnitsState);
    const setIsLoadingPurchasePricing = useSetRecoilState(isLoadingPurchasePricingState);

    const fetchPurchasePricingData = async (printHouseMaterialId: string) => {
        setIsLoadingPurchasePricing(true);

        const callBack = (res: any) => {
            setIsLoadingPurchasePricing(false);
            if (res.success) {
                setPurchasePricingData(res?.data?.data || []);
                setPurchasePricingTableHeadingUnits(res?.data?.tableHeadingUnits || {});
            } else {
                setPurchasePricingData([]);
                setPurchasePricingTableHeadingUnits({});
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

    // Local state update functions to avoid refetching data
    const updatePurchasePricingDataOrder = (reorderedData: any[]) => {
        setPurchasePricingData(reorderedData);
    };

    const removePurchasePricingDataItem = (itemId: string) => {
        setPurchasePricingData(prevData => prevData.filter(item => item.id !== itemId));
    };

    const updatePurchasePricingDataItem = (itemId: string, updatedItem: any) => {
        setPurchasePricingData(prevData =>
            prevData.map(item => item.id === itemId ? { ...item, ...updatedItem } : item)
        );
    };

    return {
        purchasePricingData,
        purchasePricingTableHeadingUnits,
        fetchPurchasePricingData,
        clearPurchasePricingData,
        updatePurchasePricingDataOrder,
        removePurchasePricingDataItem,
        updatePurchasePricingDataItem,
    };
};

export { usePurchasePricingData };
