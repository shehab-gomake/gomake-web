import { useSnackBar } from "@/hooks";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ItemCalculationType } from "@/enums/document-type-enum";

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
  const [isUpdatePackagesQuantity, setIsUpdatePackagesQuantity] = useState(null);
  const [isUpdateQuantityInPackage, setIsUpdateQuantityInPackage] = useState(null);

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
          ItemCalculationType.Amount,
          originalQuantity
        );
      }, 0);

      setIsUpdateAmount(null);
      return;
    }

    getCalculateQuoteItem(item, ItemCalculationType.Amount, item.quantity);
    setIsUpdateAmount(null);
  };

  const onInputChangeAmount = (e) => {
    changeDocumentItems(index, "quantity", e);
  };

  const onBlurDiscount = async () => {
    getCalculateQuoteItem(item, ItemCalculationType.Discount, item.discount);
    setIsUpdateDiscount(null);
  };

  const onInputChangeDiscount = (e) => {
    changeDocumentItems(index, "discount", e);
  };
  const onBlurPrice = async () => {
    getCalculateQuoteItem(item, ItemCalculationType.UnitPrice, item.price);
    setIsUpdatePrice(null);
  };
  const onInputChangePrice = (e) => {
    changeDocumentItems(index, "price", e);
  };

  const onBlurFinalPrice = async () => {
    getCalculateQuoteItem(item, ItemCalculationType.finalPrice, item.finalPrice);
    setIsUpdateFinalPrice(null);
  };
  const onInputChangeFinalPrice = (e) => {
    changeDocumentItems(index, "finalPrice", e);
  };

  const onBlurPackagesQuantity = async () => {
    const packagesQuantity = parseFloat(item?.packagesQuantity || item?.packageQuantity || "0") || 0;
    const quantityInPackage = parseFloat(item?.quantityInPackage || item?.quantityPerPackage || "0") || 0;
    const totalQuantity = packagesQuantity * quantityInPackage;
    
    if (totalQuantity > 0) {
      changeDocumentItems(index, "quantity", totalQuantity);
      // Update the item with the new quantity before calculating
      const updatedItem = { ...item, quantity: totalQuantity };
      getCalculateQuoteItem(updatedItem, ItemCalculationType.PackagesQuantity, packagesQuantity);
    }
    setIsUpdatePackagesQuantity(null);
  };

  const onInputChangePackagesQuantity = (e) => {
    changeDocumentItems(index, "packagesQuantity", e);
  };

  const onBlurQuantityInPackage = async () => {
    const packagesQuantity = parseFloat(item?.packagesQuantity || item?.packageQuantity || "0") || 0;
    const quantityInPackage = parseFloat(item?.quantityInPackage || item?.quantityPerPackage || "0") || 0;
    const totalQuantity = packagesQuantity * quantityInPackage;
    
    if (totalQuantity > 0) {
      changeDocumentItems(index, "quantity", totalQuantity);
      // Update the item with the new quantity before calculating
      const updatedItem = { ...item, quantity: totalQuantity };
      getCalculateQuoteItem(updatedItem, ItemCalculationType.QuantityInPackage, quantityInPackage);
    }
    setIsUpdateQuantityInPackage(null);
  };

  const onInputChangeQuantityInPackage = (e) => {
    changeDocumentItems(index, "quantityInPackage", e);
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
    isUpdatePackagesQuantity,
    setIsUpdatePackagesQuantity,
    onBlurPackagesQuantity,
    onInputChangePackagesQuantity,
    isUpdateQuantityInPackage,
    setIsUpdateQuantityInPackage,
    onBlurQuantityInPackage,
    onInputChangeQuantityInPackage,
  };
};

export { useQuoteTable };
