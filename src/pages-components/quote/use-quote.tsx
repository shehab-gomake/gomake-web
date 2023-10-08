import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "./use-quote-get-data";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useQuoteModals } from "./use-quote-modals";
import { useClickAway } from "@uidotdev/usehooks";
import { EHttpMethod } from "@/services/api-service/enums";

const useQuote = () => {
  const { t } = useTranslation();
  const {
    quoteItemValue,
    customersListValue,
    getQuote,
    getAllClientContacts,
    getAllClientAddress,
  } = useQuoteGetData();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const tableHeaders = [
    "ID",
    "Item name",
    "Details",
    "Amount",
    "Unit price",
    "Discount",
    "Final price",
    "More",
  ];
  const tableRowPercent = [
    "35px",
    "20%",
    "30%",
    "10%",
    "10%",
    "10%",
    "10%",
    "10%",
  ];
  const {
    selectedContact,
    openDeleteModalContact,
    selectedAddress,
    openDeleteModalAddress,
    selectedContactById,
    isAddNewContactWidget,
    selectedAddressById,
    isAddNewAddressWidget,
    openAddNewModalContact,
    openAddNewModalAddress,
    openNegotiateRequestModal,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    openDeleteItemModal,
    onCloseDeleteItemModal,
    onOpenDeleteItemModal,
    onCloseDuplicateWithDifferentQTY,
    onOpenDuplicateWithDifferentQTY,
    onCloseNewItem,
    onOpenNewItem,
    onCloseNegotiateRequest,
    onOpenNegotiateRequest,
    onCloseIsAddNewContactWidget,
    onCloseAddNewContactClient,
    onCloseAddNewAddressClient,
    onOpenAddNewContactClient,
    onOpenAddNewAddressClient,
    onCloseIsAddNewAddressWidget,
    onOpenDeleteModalContact,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    onCloseDeleteModalContact,
    setSelectedContactById,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    setSelectedAddressById,
  } = useQuoteModals();
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  useEffect(() => {
    const foundItem = customersListValue.find(
      (item: any) => item.id === quoteItemValue?.customerID
    );
    setSelectBusiness(foundItem);
  }, [quoteItemValue, customersListValue]);

  const onChangeUpdateClientContact = useCallback(
    (filedName: string, value: any) => {
      setSelectedContactById((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [selectedContactById]
  );
  const onChangeUpdateClientAddress = useCallback(
    (filedName: string, value: any) => {
      setSelectedAddressById((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [selectedAddressById]
  );

  const onClickDeleteContact = useCallback(async (item: any) => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/erp-service/quote/delete-quote-contact?quoteContactId=${item?.id}`
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseDeleteModalContact();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);
  const onClickAddNewContact = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/add-quote-contact`,
      {
        contactID: selectedContactById?.id,
        contactName: selectedContactById?.name,
        contactMail: selectedContactById?.mail,
        contactPhone: selectedContactById?.phone,
        quoteID: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseIsAddNewContactWidget();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, [selectedContactById, quoteItemValue]);
  const onClickDeleteAddress = useCallback(async (item: any) => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/erp-service/quote/delete-quote-address?quoteAddressId=${item?.id}`
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseDeleteModalAddress();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);
  const onClickAddNewAddress = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/add-quote-address`,
      {
        addressID: selectedAddressById?.id,
        street: selectedAddressById?.street,
        city: selectedAddressById?.city,
        entry: selectedAddressById?.entry,
        apartment: selectedAddressById?.apartment,
        notes: selectedAddressById?.notes,
        quoteID: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseIsAddNewAddressWidget();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, [selectedAddressById, quoteItemValue]);

  const onChangeSelectBusiness = useCallback(
    async (item: any) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/change-client`,
        {
          quoteID: quoteItemValue?.id,
          clientId: item?.id,
          userId: quoteItemValue?.userID,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        getQuote();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [selectBusiness, quoteItemValue]
  );

  const getCalculateQuote = useCallback(
    async (calculationType: number, data: number) => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/quote/get-calculate-quote`,
        {
          QuoteId: quoteItemValue?.id,
          data,
          calculationType,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        getQuote();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [quoteItemValue]
  );

  const getCalculateQuoteItem = useCallback(
    async (quoteItemId: string, calculationType: number, data: number) => {
      const res = await callApi(
        EHttpMethod.GET,
        `/v1/erp-service/quote/get-calculate-quote-item`,
        {
          QuoteItemId: quoteItemId,
          data,
          calculationType,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        getQuote();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [quoteItemValue]
  );

  const [addClientContactState, setClientContactState] = useState<any>({});

  const onChangeAddClientContactState = useCallback(
    (filedName: string, value: any) => {
      setClientContactState((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [addClientContactState]
  );
  const addNewClientContact = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/crm-service/customer/create-contact`,
      {
        contactName: addClientContactState?.contactName,
        contactMail: addClientContactState?.contactMail,
        contactPhone: addClientContactState?.contactPhone,
        clientId: quoteItemValue?.customerID,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      getAllClientContacts();
      onCloseAddNewContactClient();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue, addClientContactState]);

  const [addClientAddressState, setClientAddressState] = useState<any>({});
  const onChangeAddClientAddressState = useCallback(
    (filedName: string, value: any) => {
      setClientAddressState((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [addClientAddressState]
  );

  const addNewClientAddress = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/crm-service/customer/create-address`,
      {
        address1: addClientAddressState?.addressName,
        street: addClientAddressState?.street,
        city: addClientAddressState?.city,
        entry: addClientAddressState?.entry,
        apartment: addClientAddressState?.apartment,
        clientId: quoteItemValue?.customerID,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      getAllClientAddress();
      onCloseAddNewAddressClient();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue, addClientAddressState]);
  const [qouteItemId, setQuateItemId] = useState();
  const onClickDeleteQouteItem = (quoteItem) => {
    onOpenDeleteItemModal();
    setQuateItemId(quoteItem?.id);
  };
  const deleteQuoteItem = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.DELETE,
      `/v1/erp-service/quote/delete-quote-item?QuoteItemId=${qouteItemId}`
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseDeleteItemModal();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, [qouteItemId]);
  const onClickDuplicateWithDifferentQTY = (quoteItem) => {
    onOpenDuplicateWithDifferentQTY();
    setQuateItemId(quoteItem?.id);
  };
  const [amountVlue, setAmountValue] = useState();

  const duplicateQuoteItemWithAnotherQuantity = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/duplicate-quote-with-another-quantity`,
      {
        quoteItemId: qouteItemId,
        amount: parseInt(amountVlue),
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      onCloseDuplicateWithDifferentQTY();
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [qouteItemId, amountVlue]);
  const [selectDate, setSelectDate] = useState(quoteItemValue?.dueDate);
  const updateDueDate = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/update-due-date`,
      {
        quoteId: quoteItemValue?.id,
        dueDate: selectDate,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      getQuote();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue, selectDate]);

  return {
    tableHeaders,
    tableRowPercent,
    selectedContact,
    openDeleteModalContact,
    selectedContactById,
    isAddNewContactWidget,
    isAddNewAddressWidget,
    selectedAddressById,
    selectedAddress,
    openDeleteModalAddress,
    selectBusiness,
    openAddNewModalContact,
    openAddNewModalAddress,
    openNegotiateRequestModal,
    addClientContactState,
    addClientAddressState,
    openAddNewItemModal,
    openDuplicateWithDifferentQTYModal,
    openDeleteItemModal,
    qouteItemId,
    selectDate,
    // dateRef,
    // setActiveClickAway,
    updateDueDate,
    setSelectDate,
    onClickDeleteQouteItem,
    deleteQuoteItem,
    onCloseDeleteItemModal,
    onOpenDeleteItemModal,
    onCloseDuplicateWithDifferentQTY,
    onOpenDuplicateWithDifferentQTY,
    onCloseNewItem,
    onOpenNewItem,
    onChangeAddClientAddressState,
    addNewClientAddress,
    onChangeAddClientContactState,
    addNewClientContact,
    onCloseNegotiateRequest,
    onOpenNegotiateRequest,
    onCloseAddNewContactClient,
    onCloseAddNewAddressClient,
    onOpenAddNewContactClient,
    onOpenAddNewAddressClient,
    onChangeSelectBusiness,
    setSelectBusiness,
    onClickAddNewAddress,
    onClickDeleteAddress,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    setSelectedAddressById,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    onCloseIsAddNewAddressWidget,
    onCloseIsAddNewContactWidget,
    setSelectedContactById,
    onCloseDeleteModalContact,
    onOpenDeleteModalContact,
    onClickDeleteContact,
    onChangeUpdateClientContact,
    onClickAddNewContact,
    onChangeUpdateClientAddress,
    getCalculateQuoteItem,
    getCalculateQuote,
    setAmountValue,
    duplicateQuoteItemWithAnotherQuantity,
    onClickDuplicateWithDifferentQTY,
    t,
  };
};

export { useQuote };
