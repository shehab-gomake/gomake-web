import { useGomakeAxios, useSnackBar } from "@/hooks";
import { approveDocumentItemsApi, calculateSelectedItemsApi, getDocumentByIdApi, rejectDocumentApi, updateDocumentCommentsConfirmationApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { DOCUMENT_TYPE } from "../quotes/enums";
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
                quote.documentItems =  quote.documentItems.map(item => {
                    item.isChecked = true
                    return item;
                })
                setQuoteConfirm(res?.data);
            } else {
                alertFaultUpdate();
            }
        }
        await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id })
    }

    const approveDocumentItems = async (checkedItems) => {
        const callBack = (res) => {
            if (res?.success) {
                console.log("the result ", res?.data)
                // getQuoteConfirmation or getDoment id  THE CHEKCED IF isConfirmed IN DISPLAING BUTTONS CONTAINER
            } else {
                alertFaultUpdate();
            }
        }
        await approveDocumentItemsApi(callApi, callBack, { documentType: DOCUMENT_TYPE.quote })
    }

    const rejectDocument = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await rejectDocumentApi(callApi, callBack, { documentId: quoteConfirm?.id, quoteStatus: 0, cancelText: "test" })
    }

    const updateDocumentComments = async () => {
        const callBack = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        await updateDocumentCommentsConfirmationApi(callApi, callBack, { documentId: quoteConfirm?.id, comments: "test comments" })
    }


    const calculateSelectedItems = async (quote) => {
        const documentItemIds = quote?.documentItems?.filter(x=>x.isChecked)?.map(x=>x.id);
        const callBack = (res) => {
            if (res?.success) {
                const newQuote = res?.data;
                newQuote.documentItems =  newQuote.documentItems.map(item => {
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


    const handleItemCheck = (e,itemId) => {
        let quoteCopy = cloneDeep(quoteConfirm);
        if(quoteCopy?.documentItems){
            const documentItems = quoteConfirm?.documentItems.map(x=>x.id === itemId ? {...x,isChecked:e.target.checked} : x)
            quoteCopy = {...quoteCopy,documentItems:documentItems}
        }
        setQuoteConfirm(quoteCopy)
        calculateSelectedItems(quoteCopy);
    } 
    return {
        getQuoteConfirmation,
        approveDocumentItems,
        updateDocumentComments,
        rejectDocument,
        checkedItems,
        setCheckedItems,
        calculateSelectedItems,
        handleItemCheck
    };
};

export { useQuoteConfirmation };
