import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getDocumentByIdApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { printHouseProfile } from "@/store/print-house-profile";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

const useQuoteConfirmation = () => {
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const { alertFaultUpdate } = useSnackBar();
    const setQuoteConfirm = useSetRecoilState(quoteConfirmationState);
 

    const getQuoteConfirmation = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setQuoteConfirm(res?.data);
            } else {
                alertFaultUpdate();
            }
        }
        await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id})
    }


    useEffect(() => {
        getQuoteConfirmation();
    }, []);

    return {
        getQuoteConfirmation
    };
};

export { useQuoteConfirmation };
