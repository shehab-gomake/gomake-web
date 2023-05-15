import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { actionLists, actionProfitLists } from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import {
  getAndSetActionProfitRowByActionId,
  getAndSetActions,
} from "@/services/hooks";

const useProfits = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState<any>({});
  const { clasess } = useStyle();
  const [actionProfits, setActionProfits] =
    useRecoilState<any>(actionProfitLists);
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
  const tabelPricingHeaders = useMemo(() => {
    let isQuantity = false;
    actionProfits?.actionProfitRowsMapped?.forEach((element) => {
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
  const tabelExceptionsHeaders = useMemo(
    () => [
      t("products.profits.exceptions.type"),
      t("products.profits.exceptions.parameter"),
      t("products.profits.exceptions.value"),
      t("products.profits.exceptions.scopeOfChange"),
    ],
    []
  );
  const tabelExceptionsRows = useMemo(
    () => [
      {
        type: "machine",
        parameter: "Color =",
        value: "black",
        scopeOfChange: (
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("products.profits.exceptions.chooseScope")}
            onChange={""}
          />
        ),
      },
      {
        type: "machine",
        property: "Color =",
        value: "black",
        scopeOfChange: (
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("products.profits.exceptions.chooseScope")}
            onChange={""}
          />
        ),
      },
    ],
    []
  );
  return {
    allActions,
    selectedAction,
    tabelPricingHeaders,
    tabelExceptionsHeaders,
    tabelExceptionsRows,
    actionProfits,
    onChangeSelectedAction,
    t,
  };
};

export { useProfits };
