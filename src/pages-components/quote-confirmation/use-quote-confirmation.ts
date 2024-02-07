import { useGomakeAxios, useSnackBar } from "@/hooks";
import { approveDocumentItemsApi, getDocumentByIdApi, rejectDocumentApi, updateDocumentCommentsConfirmationApi } from "@/services/api-service/generic-doc/quote-confirmation-api";
import { quoteConfirmationState } from "@/store/quote-item";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DOCUMENT_TYPE } from "../quotes/enums";

const useQuoteConfirmation = () => {
    const router = useRouter();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
    const [quoteConfirm, setQuoteConfirm] = useRecoilState<any>(quoteConfirmationState);
     const [checkedItems, setCheckedItems] = useState({});


    const getQuoteConfirmation = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setQuoteConfirm(res?.data);
            } else {
                alertFaultUpdate();
            }
        }
        await getDocumentByIdApi(callApi, callBack, { id: router?.query?.Id })
    }

    // const updateQuoteConfirmation = async (checkedItemsIds?) => {
    //     const callBack = (res) => {
    //         if (res?.success) {
    //             setQuoteConfirm(res?.data);
    //         } else {
    //             alertFaultUpdate();
    //         }
    //     }
    //     await updateQuoteConfirmationApi(callApi, callBack, { id: router?.query?.Id, documentItemIds: checkedItemsIds })
    // }


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


    // const handleItemCheck = (itemId) => {
    //     setCheckedItems((prevCheckedItems) => {
    //         const updatedCheckedItems = {
    //             ...prevCheckedItems,
    //             [itemId]: !prevCheckedItems[itemId],
    //         };

    //         const selectedIds = Object.keys(updatedCheckedItems).filter(
    //             (id) => updatedCheckedItems[id]
    //         );

    //         console.log(updatedCheckedItems);
    //         // updateQuoteConfirmation(selectedIds);
    //         return updatedCheckedItems;
    //     });
    // };

    // useEffect(() => {
    //     if (quoteConfirm?.documentItems) {
    //         const initialCheckedItems = quoteConfirm?.documentItems.reduce((acc, item) => {
    //             acc[item.id] = true;
    //             return acc;
    //         }, {});
    //         setCheckedItems(initialCheckedItems);
    //     }
    // }, []);





    useEffect(() => {
        getQuoteConfirmation();
    }, [])

    useEffect(() => {
        if (quoteConfirm?.documentItems) {
            const initialCheckedItems = quoteConfirm?.documentItems.reduce((acc, item) => {
                acc[item.id] = true;
                return acc;
            }, {});
            console.log("initialCheckedItems", initialCheckedItems)
            setCheckedItems(initialCheckedItems);
        }
    }, [quoteConfirm]);


    return {
        getQuoteConfirmation,
        approveDocumentItems,
        updateDocumentComments,
        rejectDocument,
        checkedItems,
        setCheckedItems
    };
};

export { useQuoteConfirmation };
