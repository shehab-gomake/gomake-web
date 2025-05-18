import { useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useQuoteTable = ({
  getCalculateQuoteItem,
  getCalculateQuoteConfirmationItem,
  changeDocumentItems,
  item,
  index,
  printHouseId,
  documentType,
}) => {
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const [isUpdateAmount, setIsUpdateAmount] = useState(null);
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const [isUpdatePrice, setIsUpdatePrice] = useState(null);
  const [isUpdateFinalPrice, setIsUpdateFinalPrice] = useState(null);
  const [isUpdateApproveAmount, setIsUpdateApproveAmount] = useState(null);

  const isDeliveryNote =
    documentType === DOCUMENT_TYPE.deliveryNote ||
    documentType === DOCUMENT_TYPE.deliveryNoteRefund;
  const isInvoice =
    documentType === DOCUMENT_TYPE.invoice ||
    documentType === DOCUMENT_TYPE.invoiceRefund;

  const onBlurApproveAmount = async () => {
    getCalculateQuoteConfirmationItem(printHouseId, item?.id, item?.quantity);
    setIsUpdateApproveAmount(null);
  };

  const [originalQuantity] = useState(item.quantity);
  const onBlurAmount = async () => {
    if (
      (isDeliveryNote || isInvoice) &&
      item.maxQuantity != null &&
      item.quantity > item.maxQuantity
    ) {
      alertFault(
        `${t("alerts.itemExceedsMaxQuantity", {
          max: item.maxQuantity,
        })}`
      );

      // Revert to valid quantity
      changeDocumentItems(index, "quantity", originalQuantity);

      setTimeout(() => {
        getCalculateQuoteItem(
          { ...item, quantity: originalQuantity },
          0,
          originalQuantity
        );
      }, 0);

      setIsUpdateAmount(null);
      return;
    }

    getCalculateQuoteItem(item, 0, item.quantity);
    setIsUpdateAmount(null);
  };

  const onInputChangeAmount = (e) => {
    changeDocumentItems(index, "quantity", e);
  };

  const onBlurDiscount = async () => {
    getCalculateQuoteItem(item, 2, item.discount);
    setIsUpdateDiscount(null);
  };

  const onInputChangeDiscount = (e) => {
    changeDocumentItems(index, "discount", e);
  };
  const onBlurPrice = async () => {
    getCalculateQuoteItem(item, 1, item.price);
    setIsUpdatePrice(null);
  };
  const onInputChangePrice = (e) => {
    changeDocumentItems(index, "price", e);
  };

  const onBlurFinalPrice = async () => {
    getCalculateQuoteItem(item, 3, item.finalPrice);
    setIsUpdateFinalPrice(null);
  };
  const onInputChangeFinalPrice = (e) => {
    changeDocumentItems(index, "finalPrice", e);
  };

  return {
    t,
    isUpdateAmount,
    isUpdateDiscount,
    isUpdatePrice,
    isUpdateFinalPrice,
    setIsUpdateFinalPrice,
    onBlurFinalPrice,
    onInputChangeFinalPrice,
    setIsUpdatePrice,
    onBlurPrice,
    onInputChangePrice,
    onBlurDiscount,
    onInputChangeDiscount,
    setIsUpdateDiscount,
    setIsUpdateAmount,
    onBlurAmount,
    onInputChangeAmount,
    onBlurApproveAmount,
    isUpdateApproveAmount,
    setIsUpdateApproveAmount,
  };
};

export { useQuoteTable };
