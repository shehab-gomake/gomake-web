import { useGomakeAxios, useSnackBar } from "@/hooks";
import { calculateSelectedItemsApi, getDocumentByIdApi, updateDocumentCommentsConfirmationApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";

const useQuoteConfirmation = () => {
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(quoteConfirmationState);
    const [checkedItems, setCheckedItems] = useState({});

    const getQuoteConfirmation = async () => {
        const callBack = (res) => {
            if (res?.success) {
                const quote = res?.data;
                quote.documentItems = quote.documentItems.map(item => {
                    item.isChecked = true
                    return item; 
                }) 
                setQuoteConfirm(quote);
            } else {
                alertFaultUpdate();
            }
        }
        await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id })
    }

    const calculateSelectedItems = async (quote) => {
        const documentItemIds = quote?.documentItems?.filter(x => x.isChecked)?.map(x => x.id);
        const callBack = (res) => {
            if (res?.success) {
                const newQuote = res?.data;
                newQuote.documentItems = newQuote.documentItems.map(item => {
                    item.isChecked = documentItemIds.includes(item.id);
                    return item;
                })
               setQuoteConfirm(newQuote);
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await calculateSelectedItemsApi(callApi, callBack, { quoteId: quote?.id, documentItemIds: documentItemIds })
    }

    const handleItemCheck = (e, itemId) => {
        let quoteCopy = cloneDeep(quoteConfirm);
        if (quoteCopy?.documentItems) {
            const documentItems = quoteConfirm?.documentItems.map(x => x.id === itemId ? { ...x, isChecked: e.target.checked } : x)
            quoteCopy = { ...quoteCopy, documentItems: documentItems }
        }
        setQuoteConfirm(quoteCopy)
        calculateSelectedItems(quoteCopy);
    }
    return {
        getQuoteConfirmation,
        checkedItems,
        setCheckedItems,
        handleItemCheck
    };
};

export { useQuoteConfirmation };
