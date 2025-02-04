import { useState } from "react";

const useQuoteTable = ({
  getCalculateQuoteItem,
  changedocumentItemsChild,
  item,
  index,
  parentIndex,
  childInex,
}) => {
  const [isUpdateAmount, setIsUpdateAmount] = useState(null);
  const [isUpdateDiscount, setIsUpdateDiscount] = useState(null);
  const [isUpdatePrice, setIsUpdatePrice] = useState(null);
  const [isUpdateFinalPrice, setIsUpdateFinalPrice] = useState(null);
  const onBlurAmount = async () => {
    getCalculateQuoteItem(item, 0, item.quantity);
    setIsUpdateAmount(null);
  };
  const onInputChangeAmount = (e) => {
    changedocumentItemsChild(parentIndex, childInex, "quantity", e);
  };
  const onBlurDiscount = async () => {
    getCalculateQuoteItem(item, 2, item.discount);
    setIsUpdateDiscount(null);
  };
  const onInputChangeDiscount = (e) => {
    changedocumentItemsChild(parentIndex, childInex, "discount", e);
  };
  const onBlurPrice = async () => {
    getCalculateQuoteItem(item, 1, item.price);
    setIsUpdatePrice(null);
  };
  const onInputChangePrice = (e) => {
    changedocumentItemsChild(parentIndex, childInex, "price", e);
  };

  const onBlurFinalPrice = async () => {
    getCalculateQuoteItem(item, 3, item.finalPrice);
    setIsUpdateFinalPrice(null);
  };
  const onInputChangeFinalPrice = (e) => {
    changedocumentItemsChild(parentIndex, childInex, "finalPrice", e);
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
