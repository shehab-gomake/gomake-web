import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCallback, useMemo, useState } from "react";
import { editPriceListState } from "./store/edit-price-list";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  getAndSetActionExceptionProfitRowByActionExceptionId,
  getAndSetActionProfitRowChartData,
  getAndSetPricingListTableRows,
} from "@/services/hooks";
import { renderProfits } from "./use-profit-action.";
import { PricingListMenuWidget } from "./widgets/pricing-list/more-circle";
import { actionProfitPricingTableRowsState } from "@/store/action-profit-pricing-table-rows";
import { productTestState } from "@/store/product-test";
import { chartDataByActionProfitRow } from "@/store";

const useProfitsExeptionsFunction = ({
  getActionExceptionProfitRowByActionExceptionId,
  actionExceptionProfitIdValue,
  selectedAction,
  getActionProfits,
  setActionExceptionProfitRows,
  setactionExceptionProfitId,
  actionProfits,
  setActionProfitRowsNew,
  actionProfitRowsNew,
  selectTestDataVal,
  actionExceptionProfitRowsVal,
}: any) => {
  const [state, setState] = useState<any>({});

  const productTest = useRecoilValue<any>(productTestState);
  const setChartDataValue = useSetRecoilState<any>(chartDataByActionProfitRow);
  const [openAddQuantityModal, setOpenAddQuantityModal] = useState(false);
  const onCloseAddQuantityModal = () => {
    setOpenAddQuantityModal(false);
  };
  const onOpenAddQuantityModal = () => {
    setOpenAddQuantityModal(true);
  };
  const [openAddNewPricingStepRow, setOpenAddNewPricingStepRow] =
    useState(false);

  const [pricingListRowState, setPricingListRowState] = useState<any>({});
  const [tabelPricingHeaders, setTabelPricingHeaders] = useState([]);

  const { t } = useTranslation();

  const [selectedExceptionProfit, setSelectedExceptionProfit] = useState();
  const [editPriceListStateValue, setEditPriceListState] =
    useRecoilState<any>(editPriceListState);

  const { setSnackbarStateValue } = useSnackBar();
  const { callApi } = useGomakeAxios();

  const [openDeleteExceptionProfitModal, setOpenDeleteExceptionProfitModal] =
    useState(false);

  const onCloseDeleteExceptionProfitModal = () => {
    setOpenDeleteExceptionProfitModal(false);
  };

  const onOpenDeleteExceptionProfitModal = (item: any) => {
    setSelectedExceptionProfit(item);
    setOpenDeleteExceptionProfitModal(true);
  };

  const updateActionExceptionProfitRow = useCallback(async () => {
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/profits/update-action-exception-profit-row`,
      {
        ...editPriceListStateValue?.state,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      setEditPriceListState({ isEdit: false });
      getActionExceptionProfitRowByActionExceptionId();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [actionExceptionProfitIdValue, editPriceListStateValue]);

  const deleteActionExceptionProfitRow = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-action-exception-profit-row?Id=${id}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        getActionExceptionProfitRowByActionExceptionId();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    [actionExceptionProfitIdValue]
  );

  const deleteExceptionProfit = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-exception-profit?actionExceptionId=${id}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        getActionProfits();
        onCloseDeleteExceptionProfitModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    [selectedAction]
  );

  const [openAddExceptionModal, setOpenAddExceptionModal] = useState(false);

  const onCloseAddExceptionModal = () => {
    setOpenAddExceptionModal(false);
  };
  const onOpenAddExceptionModal = () => {
    setOpenAddExceptionModal(true);
  };

  const [actionProfitPricingTableRows, setActionProfitPricingTableRows] =
    useRecoilState<any>(actionProfitPricingTableRowsState);

  const onCklickActionExceptionProfitRow = useCallback(
    async (
      id: string,
      selectedAdditional: number,
      exceptionTypeValue: string
    ) => {
      console.log("exceptionTypeValue", {
        id,
        selectedAdditional,
        exceptionTypeValue,
        actionExceptionProfitIdValue,
      });

      if (actionExceptionProfitIdValue?.id == id) {
        setActionExceptionProfitRows("");
        setactionExceptionProfitId({});
        setTabelPricingHeaders([
          t("products.profits.pricingListWidget.cost"),
          t("products.profits.pricingListWidget.profit"),
          t("products.profits.pricingListWidget.testQuantity"),
          t("products.profits.pricingListWidget.unitPrice"),
          t("products.profits.pricingListWidget.totalPrice"),
          t("products.profits.pricingListWidget.more"),
        ]);
        await getAndSetPricingListTableRows(
          callApi,
          setActionProfitPricingTableRows,
          {
            actionId: selectedAction.id,
            productId: productTest.id,
          }
        );
        await getAndSetActionProfitRowChartData(
          callApi,
          setChartDataValue,
          {
            actionProfitId: actionProfits?.id,
          },
          actionProfits?.pricingBy
        );
      } else {
        setActionExceptionProfitRows("");
        if (exceptionTypeValue === "Additional") {
          setTabelPricingHeaders([
            t("products.profits.pricingListWidget.cost"),
            t("products.profits.pricingListWidget.profit"),
            t("products.profits.pricingListWidget.Expprofit"),
            t("products.profits.pricingListWidget.testQuantity"),
            t("products.profits.pricingListWidget.unitPrice"),
            t("products.profits.pricingListWidget.totalPrice"),
            t("products.profits.pricingListWidget.more"),
          ]);
          const mapData = actionProfitPricingTableRows?.map((item: any) => {
            const percent = item?.profit * (selectedAdditional / 100);
            const expProfit = (parseFloat(item?.profit) + percent)?.toFixed(2);
            return {
              ...renderProfits(item, {
                expProfit,
              }),
              // testFinalPrice: (
              //   item?.quantity * selectTestDataVal?.unitPrice
              // )?.toFixed(2),
              more: <PricingListMenuWidget item={item} />,
              id: item?.id,
            };
          });
          setActionProfitPricingTableRows(mapData);
          setactionExceptionProfitId({ id, type: "Additional" });
          return 0;
        }

        if (exceptionTypeValue === "EditBase") {
          setactionExceptionProfitId({});
          setTabelPricingHeaders([
            t("products.profits.pricingListWidget.cost"),
            t("products.profits.pricingListWidget.profit"),
            t("products.profits.pricingListWidget.testQuantity"),
            t("products.profits.pricingListWidget.unitPrice"),
            t("products.profits.pricingListWidget.totalPrice"),
            t("products.profits.pricingListWidget.more"),
          ]);
          await getAndSetPricingListTableRows(
            callApi,
            setActionProfitPricingTableRows,
            {
              actionId: selectedAction.id,
              productId: productTest.id,
              exceptionId: id,
            }
          );
          await getAndSetActionProfitRowChartData(
            callApi,
            setChartDataValue,
            {
              actionProfitId: actionProfits?.id,
              exceptionId: id,
            },
            actionProfits?.pricingBy
          );
          setactionExceptionProfitId({ id, type: "EditBase" });
          return 0;
        }
      }
    },
    [
      actionExceptionProfitIdValue,
      actionExceptionProfitRowsVal,
      actionProfitRowsNew,
      selectTestDataVal,
      actionProfits,
      actionProfitPricingTableRows,
      productTest,
    ]
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

  const onClickSaveNewActionExceptionProfitRow = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/add-action-exception-profit-row`,

      {
        actionExpectionId: actionExceptionProfitIdValue,
        size: pricingListRowState?.height * pricingListRowState?.width,
        quantity: pricingListRowState.quantity,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      onCloseAddQuantityModal();
      await getActionExceptionProfitRowByActionExceptionId();
      setPricingListRowState({}), setOpenAddNewPricingStepRow(false);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [pricingListRowState, actionExceptionProfitIdValue]);

  const addedNewException = useCallback(async () => {
    let newState = { ...state };
    delete newState?.priceListParameter;
    delete newState?.typeOfException;
    delete newState?.machine;
    delete newState?.subProduct;
    delete newState?.clientType;

    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/add-exception-profit`,
      {
        actionProfitId: actionProfits?.id,
        ...newState,
      }
    );
    if (res?.success) {
      if (res?.data?.data?.result?.exceptionType === 1) {
        setActionExceptionProfitRows(
          res?.data?.data?.result?.expectionProfitRows
        );
        // setactionExceptionProfitId(res?.data?.data?.result?.id);
      }
      if (res?.data?.data?.result?.exceptionType === 2) {
        // setactionExceptionProfitId(res?.data?.data?.result?.id);
        const mapData = res?.data?.data?.result?.expectionProfitRows?.map(
          (item: any) => {
            return {
              // ...(res?.data?.data?.result?.expectionProfitRows?.pricingBy === 1
              //   ? {
              //       width: item?.width,
              //       height: item?.height,
              //     }
              //   : { quantity: item?.quantity }),

              //New Display Data

              ...renderProfits(item),
              // testFinalPrice: item?.testFinalPrice?.toFixed(2) || "0",

              // meterPrice: item?.meterPrice,
              // expMeter: item?.expMeter,
              // price: item?.price,
              // totalPrice: item?.totalPrice,
              more: <PricingListMenuWidget item={item} />,
              id: item?.id,
              recordID: item?.recordID,
            };
          }
        );
        setActionExceptionProfitRows(mapData);
      }
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      onCloseAddExceptionModal();
      getActionProfits(false);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [state]);

  const updateActionProfitMinPrice = useCallback(
    async (value) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit`,
        {
          printingActionId: actionProfits?.printingActionId,
          id: actionProfits?.id,
          recordID: actionProfits?.recordID,
          minPrice: value,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [actionProfits]
  );
  const onChangeState = (key: any, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  return {
    tabelExceptionsHeaders,
    openDeleteExceptionProfitModal,
    editPriceListStateValue,
    selectedExceptionProfit,
    openAddExceptionModal,
    tabelPricingHeaders,
    pricingListRowState,
    openAddQuantityModal,
    openAddNewPricingStepRow,
    state,
    setEditPriceListState,
    updateActionExceptionProfitRow,
    setSnackbarStateValue,
    deleteActionExceptionProfitRow,
    deleteExceptionProfit,
    setOpenDeleteExceptionProfitModal,
    onOpenDeleteExceptionProfitModal,
    setSelectedExceptionProfit,
    onCloseAddExceptionModal,
    onOpenAddExceptionModal,
    setOpenAddExceptionModal,
    onCklickActionExceptionProfitRow,
    setTabelPricingHeaders,
    onCloseDeleteExceptionProfitModal,
    onClickSaveNewActionExceptionProfitRow,
    addedNewException,
    setPricingListRowState,
    setOpenAddQuantityModal,
    onCloseAddQuantityModal,
    onOpenAddQuantityModal,
    setOpenAddNewPricingStepRow,
    setState,
    updateActionProfitMinPrice,
    onChangeState,
  };
};

export { useProfitsExeptionsFunction };
