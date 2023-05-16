import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";
import { useRecoilState } from "recoil";
import {
  actionLists,
  actionProfitLists,
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
} from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import {
  getAndSetActionProfitRowByActionId,
  getAndSetActions,
  getAndSetProducts,
  getAndSetMachinces,
  getAndSetParameters,
  getAndSetClientTypes,
} from "@/services/hooks";

const useProfits = () => {
  const [machincesStateValue, setMachincesState] =
    useRecoilState<any>(machincesState);
  const [productsStateValue, setProductsState] =
    useRecoilState<any>(productsState);
  const [parametersStateValue, setParametersState] =
    useRecoilState<any>(parametersState);
  const [clientTypesStateValue, setClientTypesState] =
    useRecoilState<any>(clientTypesState);

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState<any>({});
  const [openAddExceptionModal, setOpenAddExceptionModal] = useState(false);
  const onCloseAddExceptionModal = () => {
    setOpenAddExceptionModal(false);
  };
  const onOpenAddExceptionModal = () => {
    setOpenAddExceptionModal(true);
  };
  const { clasess } = useStyle();
  const [actionProfits, setActionProfits] =
    useRecoilState<any>(actionProfitLists);
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);

  const getParameters = useCallback(async () => {
    await getAndSetParameters(callApi, setParametersState);
  }, []);

  const getClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesState);
  }, []);

  const getActionProfits = useCallback(async () => {
    await getAndSetActionProfitRowByActionId(callApi, setActionProfits, {
      actionId: selectedAction?.id,
    });
  }, [selectedAction]);
  const getMachincesProfits = useCallback(async () => {
    await getAndSetMachinces(callApi, setMachincesState);
  }, []);
  const getProducts = useCallback(async () => {
    await getAndSetProducts(callApi, setProductsState);
  }, []);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
  }, []);

  useEffect(() => {
    getActions();
    getMachincesProfits();
    getProducts();
    getParameters();
    getClientTypes();
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

  const updateActionProfit = useCallback(
    async (value: number) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit`,
        {
          transitionType: value,
          printingActionId: actionProfits?.printingActionId,
          recordID: actionProfits?.recordID,
          id: actionProfits?.id,
        }
      );
      getActionProfits();
    },
    [actionProfits]
  );
  return {
    allActions,
    selectedAction,
    tabelPricingHeaders,
    tabelExceptionsHeaders,
    tabelExceptionsRows,
    actionProfits,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    openAddExceptionModal,
    updateActionProfit,
    onChangeSelectedAction,
    onCloseAddExceptionModal,
    onOpenAddExceptionModal,
    t,
  };
};

export { useProfits };
