import { useTranslation } from "react-i18next";
import { useQuoteGetData } from "./use-quote-get-data";
import { useCallback, useState } from "react";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useQuote = () => {
  const { t } = useTranslation();
  const { quoteItemValue, getQuote } = useQuoteGetData();
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
  const [selectedContactById, setSelectedContactById] = useState<any>();
  const [isAddNewContactWidget, setIsAddNewContactWidget] = useState(false);

  const onCloseIsAddNewContactWidget = () => {
    setSelectedContactById({});
    setIsAddNewContactWidget(false);
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
  const onCloseDeleteModalContact = () => {
    setOpenDeleteModalContact(false);
  };
  const onOpenDeleteModalContact = (item) => {
    setSelectedContact(item);
    setOpenDeleteModalContact(true);
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

  return {
    tableHeaders,
    tableRowPercent,
    selectedContact,
    openDeleteModalContact,
    selectedContactById,
    isAddNewContactWidget,
    setIsAddNewContactWidget,
    onCloseIsAddNewContactWidget,
    setSelectedContactById,
    onCloseDeleteModalContact,
    onOpenDeleteModalContact,
    onClickDeleteContact,
    onChangeUpdateClientContact,
    onClickAddNewContact,
    t,
  };
};

export { useQuote };
