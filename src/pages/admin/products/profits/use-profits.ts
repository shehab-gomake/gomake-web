import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { actionLists } from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAndSetActions } from "@/services/hooks";

const useProfits = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState({});
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tabelHeaders = useMemo(
    () => [
      t("products.profits.pricingListWidget.quantity"),
      t("products.profits.pricingListWidget.cost"),
      t("products.profits.pricingListWidget.profit"),
      t("products.profits.pricingListWidget.meterPrice"),
      t("products.profits.pricingListWidget.expMeter"),
      t("products.profits.pricingListWidget.price"),
      t("products.profits.pricingListWidget.totalPrice"),
      t("products.profits.pricingListWidget.more"),
    ],
    []
  );
  const tabelRows = useMemo(
    () => [
      {
        Quantity: 134,
        Cost: 443,
        Profit: 21,
        MeterPrice: 468,
        Exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
      {
        Quantity: 134,
        Cost: 443,
        Profit: 21,
        MeterPrice: 468,
        Exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
    ],
    []
  );

  return {
    allActions,
    selectedAction,
    tabelHeaders,
    tabelRows,
    onChangeSelectedAction,
    t,
  };
};

export { useProfits };
