import { useEffect, useState } from "react";

const usePriceList = ({
  changeactionProfitRowsItems,
  index,
  updateActionProfitRow,
  item,
}) => {
  const [isUpdateCost, setIsUpdateCost] = useState(null);
  const [isUpdatTotalPrice, setIsUpdateTotalPrice] = useState(null);
  const [isUpdateProfit, setIsUpdateProfit] = useState(null);
  const [profit, setProfit] = useState<any>();
  useEffect(() => {
    item?.value === 0
      ? setProfit(0)
      : setProfit(((item?.totalPrice - item?.value) / item?.value) * 100);
    item?.value === 0;
  }, [item]);
  const onBlurCost = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateCost(null);
  };
  const onBlurTotalPrice = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateTotalPrice(null);
  };
  const onBlurProfit = async (item) => {
    const totalPrice = (item?.value * (1 + profit)) / 100;
    changeactionProfitRowsItems(index, "totalPrice", totalPrice);
    if (totalPrice) {
      updateActionProfitRow({ ...item, totalPrice });
      setIsUpdateProfit(null);
    }
  };
  const onInputChangeCost = (e) => {
    changeactionProfitRowsItems(index, "value", e);
  };
  const onInputChangeTotalPrice = (e) => {
    changeactionProfitRowsItems(index, "totalPrice", e);
  };
  const onInputChangeProfit = (e) => {
    setProfit(e);
  };

  return {
    isUpdateCost,
    isUpdatTotalPrice,
    isUpdateProfit,
    profit,
    setIsUpdateProfit,
    onBlurProfit,
    onInputChangeProfit,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurCost,
    onInputChangeCost,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
  };
};

export { usePriceList };
