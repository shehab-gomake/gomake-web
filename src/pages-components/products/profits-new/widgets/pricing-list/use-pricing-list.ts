import { useEffect, useState } from "react";
import { EPricingBy } from "../../enums/profites-enum";

const usePriceList = ({
  changeactionProfitRowsItems,
  index,
  updateActionProfitRow,
  item,
  selectedPricingBy,
}) => {
  const [isUpdateCost, setIsUpdateCost] = useState(null);
  const [isUpdatTotalPrice, setIsUpdateTotalPrice] = useState(null);
  const [isUpdateProfit, setIsUpdateProfit] = useState(null);
  const [isUpdateUnitPrice, setIsUpdateUnitPrice] = useState(null);
  const [profit, setProfit] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  useEffect(() => {
    if (selectedPricingBy?.value === EPricingBy.COST) {
      item?.value === 0
        ? setProfit(0)
        : setProfit(((item?.totalPrice - item?.value) / item?.value) * 100);
    } else {
      setUnitPrice(item?.totalPrice / item?.value);
    }
  }, [item, selectedPricingBy, EPricingBy]);
  const onBlurCost = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateCost(null);
  };
  const onBlurTotalPrice = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateTotalPrice(null);
  };
  const onBlurProfit = async (item) => {
    updateActionProfitRow({
      ...item,
      totalPrice: (item?.value * (1 + profit)) / 100,
    });
    setIsUpdateProfit(null);
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

  const onBlurUnitPrice = async (item) => {
    updateActionProfitRow({
      ...item,
      totalPrice: unitPrice * item?.value,
    });
    setIsUpdateUnitPrice(null);
  };
  const onInputChangeUnitPrice = (e) => {
    setUnitPrice(e);
  };

  return {
    isUpdateCost,
    isUpdatTotalPrice,
    isUpdateProfit,
    profit,
    unitPrice,
    isUpdateUnitPrice,
    setIsUpdateUnitPrice,
    setIsUpdateProfit,
    onBlurProfit,
    onInputChangeProfit,
    setIsUpdateTotalPrice,
    setIsUpdateCost,
    onBlurCost,
    onInputChangeCost,
    onBlurTotalPrice,
    onInputChangeTotalPrice,
    onBlurUnitPrice,
    onInputChangeUnitPrice,
  };
};

export { usePriceList };
