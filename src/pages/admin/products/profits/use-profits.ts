import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { actionLists, actionProfitLists } from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAndSetActionProfitRowByActionId,
  getAndSetActions,
} from "@/services/hooks";

const useProfits = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [actionProfits, setActionProfits] =
    useRecoilState<any>(actionProfitLists);
  console.log("actionProfits", actionProfits);
  const [selectedAction, setSelectedAction] = useState<any>({});
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);
  const getActionProfits = useCallback(async () => {
    await getAndSetActionProfitRowByActionId(callApi, setActionProfits, {
      actionId: selectedAction?.id,
    });
  }, [selectedAction]);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  useEffect(() => {
    getActionProfits();
  }, [selectedAction]);
  const tabelHeaders = useMemo(() => {
    let isQuantity = false;
    actionProfits?.forEach((element) => {
      if (element.hasOwnProperty("quantity")) {
        isQuantity = true;
        return;
      }
    });
    return [
      ...(isQuantity
        ? [t("products.profits.pricingListWidget.quantity")]
        : [
            t("products.profits.pricingListWidget.width"),
            t("products.profits.pricingListWidget.height"),
          ]),
      t("products.profits.pricingListWidget.cost"),
      t("products.profits.pricingListWidget.profit"),
      t("products.profits.pricingListWidget.meterPrice"),
      t("products.profits.pricingListWidget.expMeter"),
      t("products.profits.pricingListWidget.price"),
      t("products.profits.pricingListWidget.totalPrice"),
      t("products.profits.pricingListWidget.more"),
    ];
  }, [actionProfits]);

  return {
    allActions,
    selectedAction,
    tabelHeaders,
    actionProfits,
    onChangeSelectedAction,
    t,
  };
};

export { useProfits };
