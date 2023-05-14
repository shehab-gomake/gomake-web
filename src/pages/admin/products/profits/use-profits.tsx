import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import { actionLists } from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAndSetActions } from "@/services/hooks";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";

const useProfits = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState({});
  const { clasess } = useStyle();
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tabelPricingHeaders = useMemo(
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
  const tabelPricingRows = useMemo(
    () => [
      {
        quantity: 134,
        Cost: 443,
        profit: 21,
        meterPrice: 468,
        exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
      {
        quantity: 134,
        cost: 443,
        profit: 21,
        meterPrice: 468,
        exp: 55,
        total: 445,
        price: 52,
        more: "Edit",
      },
    ],
    []
  );
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
    tabelPricingRows,
    tabelExceptionsHeaders,
    tabelExceptionsRows,
    onChangeSelectedAction,
    t,
  };
};

export { useProfits };
