import { useState } from "react";

const useQuoteTable = ({
  getCalculateQuoteItem,
  changedocumentItems,
  item,
  index,
}) => {
  const [isUpdateAmount, setIsUpdateAmount] = useState(null);
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const [isUpdatePrice, setIsUpdatePrice] = useState(null);
  const [isUpdateFinalPrice, setIsUpdateFinalPrice] = useState(null);
  const onBlurAmount = async () => {
    getCalculateQuoteItem(item?.id, 0, item.quantity);
    setIsUpdateAmount(null);
  };
  const onInputChangeAmount = (e) => {
    changedocumentItems(index, "quantity", e);
  };
  const onBlurDiscount = async () => {
    getCalculateQuoteItem(item?.id, 2, item.discount);
    setIsUpdateDiscount(null);
  };
  const onInputChangeDiscount = (e) => {
    changedocumentItems(index, "discount", e);
  };
  const onBlurPrice = async () => {
    getCalculateQuoteItem(item?.id, 1, item.price);
    setIsUpdatePrice(null);
  };
  const onInputChangePrice = (e) => {
    changedocumentItems(index, "price", e);
  };

  const onBlurFinalPrice = async () => {
    getCalculateQuoteItem(item?.id, 3, item.finalPrice);
    setIsUpdateFinalPrice(null);
  };
  const onInputChangeFinalPrice = (e) => {
    changedocumentItems(index, "finalPrice", e);
  };


  return {
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
  };
};

export { useQuoteTable };
