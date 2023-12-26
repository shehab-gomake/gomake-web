import { useEffect, useState } from "react";
import { EPricingBy } from "../../enums/profites-enum";
import { useRouter } from "next/router";

const usePriceList = ({
  changeactionProfitRowsItems,
  index,
  updateActionProfitRow,
  item,
  selectedPricingBy,
}) => {
  const router = useRouter();
  const [isUpdateCost, setIsUpdateCost] = useState(null);
  const [isUpdatTotalPrice, setIsUpdateTotalPrice] = useState(null);
  const [isUpdatProfitValue, setIsUpdateProfitValue] = useState(null);
  const [isUpdateProfit, setIsUpdateProfit] = useState(null);
  const [isUpdateUnitPrice, setIsUpdateUnitPrice] = useState(null);
  const [profit, setProfit] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [isUpdatecaseQuantity, setIsUpdatecaseQuantity] = useState(null);
  const [isUpdateCaseCost, setIsUpdateCaseCost] = useState(null);

  useEffect(() => {
    if (selectedPricingBy?.value === EPricingBy.COST) {
      if (router.query.draftId) {
        setUnitPrice(
          item?.caseQuantity != 0 ? item?.totalPrice / item?.caseCost : 0
        );
      }
      item?.value === 0
        ? setProfit(0)
        : setProfit(((item?.totalPrice - item?.value) / item?.value) * 100);
    } else {
      if (router.query.draftId) {
        item?.caseCost === 0
          ? setProfit(0)
          : setProfit(
              ((item?.totalPrice - item?.caseCost) / item?.value) * 100
            );
      }
      setUnitPrice(item?.totalPrice / item?.value);
    }
  }, [item, selectedPricingBy, EPricingBy, router]);
  const onBlurCost = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateCost(null);
  };
  const onBlurCaseQuantity = async (item) => {
    updateActionProfitRow(item);
    setIsUpdatecaseQuantity(null);
  };
  const onBlurCaseCost = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateCaseCost(null);
  };
  const onBlurTotalPrice = async (item) => {
    updateActionProfitRow(item);
    setIsUpdateTotalPrice(null);
  };
  const onBlurProfit = async (item) => {
    updateActionProfitRow({
      ...item,
      // totalPrice: (item?.value * (1 + profit)) / 100,
      totalPrice: profit * (item?.value / 100) + item?.value,
    });
    setIsUpdateProfit(null);
  };
  const onInputChangeCost = (e) => {
    changeactionProfitRowsItems(index, "value", e);
  };
  const onInputChangeCaseQuantity = (e) => {
    changeactionProfitRowsItems(index, "caseQuantity", e);
  };
  const onInputChangeCaseCost = (e) => {
    changeactionProfitRowsItems(index, "caseCost", e);
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
    isUpdatProfitValue,
    isUpdatecaseQuantity,
    isUpdateCaseCost,
    onBlurCaseCost,
    onInputChangeCaseCost,
    setIsUpdateCaseCost,
    setIsUpdatecaseQuantity,
    setIsUpdateProfitValue,
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
    onBlurCaseQuantity,
    onInputChangeCaseQuantity,
  };
};

export { usePriceList };
