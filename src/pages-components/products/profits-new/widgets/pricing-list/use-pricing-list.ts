import { useState } from "react";

const usePriceList = ({ changeactionProfitRowsItems, index }) => {
  const [isUpdateCost, setIsUpdateCost] = useState(null);
  const [isUpdatTotalPrice, setIsUpdateTotalPrice] = useState(null);
  const onBlurDiscount = async () => {
    console.log("ddd");
    setIsUpdateCost(null);
  };
  const onBlurTotalPrice = async () => {
    console.log("ddd");
    setIsUpdateTotalPrice(null);
  };
  const onInputChangeDiscount = (e) => {
    changeactionProfitRowsItems(index, "value", e);
  };
  const onInputChangeTotalPrice = (e) => {
    changeactionProfitRowsItems(index, "totalPrice", e);
  };

  return {
    isUpdateCost,
    isUpdatTotalPrice,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurDiscount,
    onInputChangeDiscount,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
  };
};

export { usePriceList };
