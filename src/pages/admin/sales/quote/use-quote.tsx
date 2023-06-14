import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "./use-quote-get-data";
import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";

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
  const [selectedContact, setSelectedContact] = useState();
  const [openDeleteModalContact, setOpenDeleteModalContact] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [openDeleteModalAddress, setOpenDeleteModalAddress] = useState(false);
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);
  const [selectedAddressById, setSelectedAddressById] = useState<any>();
  const [isAddNewAddressWidget, setIsAddNewAddressWidget] = useState(false);
  const [selectBusiness, setSelectBusiness] = useState<any>({});
  useEffect(() => {
    const foundItem = customersListValue.find(
      (item: any) => item.id === quoteItemValue?.customerID
    );
    setSelectBusiness(foundItem);
  }, [quoteItemValue, customersListValue]);
  const onCloseIsAddNewContactWidget = () => {
    setSelectedContactById({});
    setIsAddNewContactWidget(false);
  };
  const onCloseIsAddNewAddressWidget = () => {
    setSelectedAddressById({});
    setIsAddNewAddressWidget(false);
  };
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
  const onCloseDeleteModalContact = () => {
    setOpenDeleteModalContact(false);
  };
  const onOpenDeleteModalContact = (item) => {
    setSelectedContact(item);
    setOpenDeleteModalContact(true);
  };

  const onCloseDeleteModalAddress = () => {
    setOpenDeleteModalAddress(false);
  };
  const onOpenDeleteModalAddress = (item) => {
    setSelectedAddress(item);
    setOpenDeleteModalAddress(true);
  };
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
    onChangeSelectBusiness,
    setSelectBusiness,
    onClickAddNewAddress,
    onClickDeleteAddress,
    setSelectedAddress,
    setOpenDeleteModalAddress,
    onCloseDeleteModalAddress,
    onOpenDeleteModalAddress,
    setIsAddNewAddressWidget,
    onCloseIsAddNewAddressWidget,
    setIsAddNewContactWidget,
    onCloseIsAddNewContactWidget,
    setSelectedContactById,
    onCloseDeleteModalContact,
    onOpenDeleteModalContact,
    onClickDeleteContact,
    onChangeUpdateClientContact,
    onClickAddNewContact,
    onChangeUpdateClientAddress,
    setSelectedAddressById,
    t,
  };
};

export { useQuote };
