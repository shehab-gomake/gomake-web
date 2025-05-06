import { useState } from "react";
import { useTranslation } from "react-i18next";

const useQuoteTable = ({
  getCalculateQuoteItem,
  getCalculateQuoteConfirmationItem,
  changedocumentItems,
  item,
  index,
  printHouseId,
}) => {
  const { t } = useTranslation();
  const [isUpdateAmount, setIsUpdateAmount] = useState(null);
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const [isUpdatePrice, setIsUpdatePrice] = useState(null);
  const [isUpdateFinalPrice, setIsUpdateFinalPrice] = useState(null);
  const [isUpdateApproveAmount, setIsUpdateApproveAmount] = useState(null);

  const onBlurApproveAmount = async () => {
    getCalculateQuoteConfirmationItem(printHouseId, item?.id, item?.quantity);
    setIsUpdateApproveAmount(null);
  };

  const onBlurAmount = async () => {
    getCalculateQuoteItem(item, 0, item.quantity);
    setIsUpdateAmount(null);
  };

  const onInputChangeAmount = (e) => {
    changedocumentItems(index, "quantity", e);
  };

  const onBlurDiscount = async () => {
    getCalculateQuoteItem(item, 2, item.discount);
    setIsUpdateDiscount(null);
  };

  const onInputChangeDiscount = (e) => {
    changedocumentItems(index, "discount", e);
  };
  const onBlurPrice = async () => {
    getCalculateQuoteItem(item, 1, item.price);
    setIsUpdatePrice(null);
  };
  const onInputChangePrice = (e) => {
    changedocumentItems(index, "price", e);
  };

  const onBlurFinalPrice = async () => {
    getCalculateQuoteItem(item, 3, item.finalPrice);
    setIsUpdateFinalPrice(null);
  };
  const onInputChangeFinalPrice = (e) => {
    changedocumentItems(index, "finalPrice", e);
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
