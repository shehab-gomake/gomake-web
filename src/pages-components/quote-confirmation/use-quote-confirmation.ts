import { useGomakeAxios, useSnackBar } from "@/hooks";
import { calculateSelectedItemsApi, getDocumentByIdApi, updateDocumentCommentsConfirmationApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import cloneDeep from "lodash.clonedeep";
import { getPrePaymentByIdApi } from "@/services/api-service/pay/pay-api";
import { DOCUMENT_TYPE } from "../quotes/enums";
import { useTranslation } from "react-i18next";

const useQuoteConfirmation = () => {
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(quoteConfirmationState);
    const [checkedItems, setCheckedItems] = useState({});
    const { i18n } = useTranslation();

    const getQuoteConfirmation = async () => {
        const callBack = (res) => {
            if (res?.success) {
                const quote = res?.data;
                quote.documentItems = quote.documentItems.map(item => {
                    item.isChecked = true
                    return item;
                })
                quote.clientLang && i18n.changeLanguage(quote.clientLang);
                setQuoteConfirm(quote);
            } else {
                alertFaultUpdate();
            }
        }
        await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id })
    }

    const getPrePaymentById = async () => {
        const callBack = (res) => {
            if (res?.success) {
                const quote = res?.data;
                setQuoteConfirm(quote);
                quote.clientLang && i18n.changeLanguage(quote.clientLang);
            } else {
                alertFaultUpdate();
            }
        }
        await getPrePaymentByIdApi(callApi, callBack, { recordId: router?.query?.recordId, documentType: DOCUMENT_TYPE.order })
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
        handleItemCheck,
        getPrePaymentById
    };
};

export { useQuoteConfirmation };
