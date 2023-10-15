import { quoteItemState } from "@/store";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { EHttpMethod } from "@/services/api-service/enums";
import { QuoteStatuses } from "./enums";

const useTotalPriceAndVat = () => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const [quoteItems, setquoteItems] = useState<any>([]);
  const [checked, setChecked] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const [openOtherReasonModal, setOpenOtherReasonModal] = useState(false);
  const [openOrderNowModal, setOpenOrderNowModal] = useState(false);
  const [openIrreleventCancelModal, setOpenIrreleventCancelModal] =
    useState(false);
  const [openPriceCancelModal, setOpenPriceCancelModal] = useState(false);
  const [openDeliveryTimeCancelModal, setOpenDeliveryTimeCancelModal] =
    useState(false);
  const onClcikOpenModal = () => {
    setOpenOtherReasonModal(true);
  };
  const onClcikCloseModal = () => {
    setOpenOtherReasonModal(false);
  };

  const onClcikOpenOrderNowModal = () => {
    setOpenOrderNowModal(true);
  };
  const onClcikCloseOrderNowModal = () => {
    setOpenOrderNowModal(false);
  };

  const onClcikOpenIrreleventModal = () => {
    setOpenIrreleventCancelModal(true);
  };
  const onClcikCloseIrreleventModal = () => {
    setOpenIrreleventCancelModal(false);
  };

  const onClcikOpenPriceModal = () => {
    setOpenPriceCancelModal(true);
  };
  const onClcikClosePriceModal = () => {
    setOpenPriceCancelModal(false);
  };

  const onClcikOpenDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(true);
  };
  const onClcikCloseDeliveryTimeModal = () => {
    setOpenDeliveryTimeCancelModal(false);
  };

  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const changeItems = useCallback(
    (filedName: string, value: any) => {
      setquoteItems((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [quoteItems]
  );

  useEffect(() => {
    setquoteItems(quoteItemValue);
  }, [quoteItemValue]);

  const btnTabs = [
    {
      name: t("sales.quote.print"),
      onclick: () => null,
    },
    {
      name: t("sales.quote.saveQoute"),
      onclick: () => onClickSaveQoute,
    },
    {
      name: t("sales.quote.sendQuote"),
      onclick: () => null,
    },
    {
      name: t("sales.quote.cancel"),
      onclick: () => handleChange,
    },
  ];
  const updateCancelQuote = useCallback(
    async (quoteStatus: number) => {
      const res = await callApi(
        EHttpMethod.PUT,
        `/v1/erp-service/quote/cancel-quote-state`,
        {
          quoteId: quoteItemValue?.id,
          quoteStatus: quoteStatus,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        navigate("/home");
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
  const onClickCancelOffer = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/quote/cancel-quote-state`,
      {
        quoteId: quoteItemValue?.id,
        quoteStatus: QuoteStatuses.CANCELED_OTHER,
        cancelText: reasonText,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      navigate("/home");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue, reasonText]);

  const onClickSaveQoute = useCallback(async () => {
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/save-qoute`,
      {
        quoteId: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      navigate("/home");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue, reasonText]);

  const onClickConfirmWithoutNotification = useCallback(async () => {
    console.log("onClickConfirmWithoutNotification");
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/order/create-new-order`,
      {
        quoteId: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      navigate("/orders");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue]);
  const onClickConfirmWithNotification = useCallback(async () => {
    console.log("onClickConfirmWithNotification");
    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/order/create-new-order`,
      {
        quoteId: quoteItemValue?.id,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      navigate("/orders");
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [quoteItemValue]);

  return {
    btnTabs,
    quoteItemValue,
    quoteItems,
    quoteStateValue,
    checked,
    openOtherReasonModal,
    reasonText,
    openIrreleventCancelModal,
    openPriceCancelModal,
    openDeliveryTimeCancelModal,
    openOrderNowModal,
    onClickConfirmWithoutNotification,
    onClickConfirmWithNotification,
    onClcikOpenOrderNowModal,
    onClcikCloseOrderNowModal,
    onClcikOpenIrreleventModal,
    onClcikCloseIrreleventModal,
    onClcikOpenPriceModal,
    onClcikClosePriceModal,
    onClcikOpenDeliveryTimeModal,
    onClcikCloseDeliveryTimeModal,
    changeItems,
    onClcikOpenModal,
    onClcikCloseModal,
    updateCancelQuote,
    setReasonText,
    onClickCancelOffer,
    onClickSaveQoute,
    t,
  };
};

export { useTotalPriceAndVat };
