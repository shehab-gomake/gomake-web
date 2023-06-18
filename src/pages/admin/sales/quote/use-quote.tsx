import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "./use-quote-get-data";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useQuoteModals } from "./use-quote-modals";

const useQuote = () => {
  const { t } = useTranslation();
  const { quoteItemValue, customersListValue, getQuote } = useQuoteGetData();
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
      "DELETE",
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
      "POST",
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
      "DELETE",
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
      "POST",
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
      const res = await callApi("PUT", `/v1/erp-service/quote/change-client`, {
        quoteID: quoteItemValue?.id,
        clientId: item?.id,
        userId: quoteItemValue?.userID,
      });
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
        "GET",
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
        "GET",
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
    t,
  };
};

export { useQuote };
