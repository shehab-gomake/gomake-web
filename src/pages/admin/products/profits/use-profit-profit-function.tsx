import { useGomakeAxios } from "@/hooks";
import {
  getAndSetActionProfitRowChartData,
  getAndSetPricingListTableRows,
} from "@/services/hooks";
import {
  actionExceptionProfitId,
  actionProfitRows,
  chartDataByActionProfitRow,
} from "@/store";
import { actionProfitPricingTableRowsState } from "@/store/action-profit-pricing-table-rows";
import { productTestState } from "@/store/product-test";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const useProfitsProfitsFunction = ({
  setSnackbarStateValue,
  editPriceListStateValue,
  actionProfits,
  setEditPriceListState,
  getActionProfits,
  selectedAction,
  pricingListRowState,
  setPricingListRowState,
  setOpenAddNewPricingStepRow,
  onCloseAddQuantityModal,
  actionProfitRowsNew,
  selectTestDataVal,
  getActionProfitRowChartData,
}: any) => {
  const { callApi } = useGomakeAxios();

  const [actionExceptionProfitIdValue, setactionExceptionProfitId] =
    useRecoilState<any>(actionExceptionProfitId);
  const { t } = useTranslation();
  const [actionProfitPricingTableRows, setActionProfitPricingTableRows] =
    useRecoilState<any>(actionProfitPricingTableRowsState);
  const productTest = useRecoilValue<any>(productTestState);
  const setChartDataValue = useSetRecoilState<any>(chartDataByActionProfitRow);

  const updateActionProfitRow = useCallback(async () => {
    console.log("editPriceListStateValue", editPriceListStateValue);
    let res;
    if (editPriceListStateValue?.state?.changeOn == "totalPrice") {
      let totalPrice = editPriceListStateValue?.state?.totalPrice;
      let unitPrice = editPriceListStateValue?.state?.unitPrice;
      let profit = editPriceListStateValue?.state?.profit;
      let cost = editPriceListStateValue?.state?.cost;
      profit = (totalPrice / cost - 1) * 100;
      console.log("datadatadata", { totalPrice, unitPrice, profit, cost });

      res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit-row`,
        {
          id: editPriceListStateValue?.state?.id,
          actionId: editPriceListStateValue?.state?.actionId,
          quantity: editPriceListStateValue?.state?.quantity,
          cost: editPriceListStateValue?.state?.cost,
          profit: profit,
          actionProfitId: actionProfits?.id,
          recordId:
            editPriceListStateValue?.state?.recordID ||
            editPriceListStateValue?.state?.more?.props?.item?.recordID,
          ...(actionExceptionProfitIdValue?.id?.length && {
            exceptionId: actionExceptionProfitIdValue.id,
          }),
        }
      );
    } else if (editPriceListStateValue?.state?.changeOn == "unitPrice") {
      let totalPrice = editPriceListStateValue?.state?.totalPrice;
      let unitPrice = editPriceListStateValue?.state?.unitPrice;
      let quantity = editPriceListStateValue?.state?.quantity;
      let profit = editPriceListStateValue?.state?.profit;
      let cost = editPriceListStateValue?.state?.cost;

      totalPrice = unitPrice * quantity;
      profit = (totalPrice / cost - 1) * 100;
      console.log("datadatadata", { totalPrice, unitPrice, profit, cost });

      res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit-row`,
        {
          id: editPriceListStateValue?.state?.id,
          actionId: editPriceListStateValue?.state?.actionId,
          quantity: editPriceListStateValue?.state?.quantity,
          cost: editPriceListStateValue?.state?.cost,
          profit: profit,
          actionProfitId: actionProfits?.id,
          recordId:
            editPriceListStateValue?.state?.recordID ||
            editPriceListStateValue?.state?.more?.props?.item?.recordID,
          ...(actionExceptionProfitIdValue?.id?.length && {
            exceptionId: actionExceptionProfitIdValue.id,
          }),
        }
      );
    } else {
      res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit-row`,
        {
          id: editPriceListStateValue?.state?.id,
          actionId: editPriceListStateValue?.state?.actionId,
          quantity: editPriceListStateValue?.state?.quantity,
          cost: editPriceListStateValue?.state?.cost,
          profit: editPriceListStateValue?.state?.profit,
          actionProfitId: actionProfits?.id,
          recordId:
            editPriceListStateValue?.state?.recordID ||
            editPriceListStateValue?.state?.more?.props?.item?.recordID,
          ...(actionExceptionProfitIdValue?.id?.length && {
            exceptionId: actionExceptionProfitIdValue.id,
          }),
        }
      );
    }

    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      setEditPriceListState({ isEdit: false });
      // getActionProfits();
      await getAndSetPricingListTableRows(
        callApi,
        setActionProfitPricingTableRows,
        {
          actionId: selectedAction.id,
          productId: productTest.id,
          ...(actionExceptionProfitIdValue?.id?.length && {
            exceptionId: actionExceptionProfitIdValue.id,
          }),
        }
      );
      await getAndSetActionProfitRowChartData(
        callApi,
        setChartDataValue,
        {
          actionProfitId: actionProfits?.id,
          ...(actionExceptionProfitIdValue?.id?.length && {
            exceptionId: actionExceptionProfitIdValue.id,
          }),
        },
        actionProfits?.pricingBy
      );
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [
    selectedAction,
    editPriceListStateValue,
    actionProfits,
    productTest,
    actionProfitPricingTableRows,
    actionExceptionProfitIdValue,
  ]);
  const deleteActionProfitRow = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-action-profit-row?Id=${id}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        // getActionProfits();
        await getAndSetPricingListTableRows(
          callApi,
          setActionProfitPricingTableRows,
          {
            actionId: selectedAction.id,
            productId: productTest.id,
            ...(actionExceptionProfitIdValue?.id?.length && {
              exceptionId: actionExceptionProfitIdValue.id,
            }),
          }
        );
        getActionProfitRowChartData();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    [selectedAction, productTest, actionExceptionProfitIdValue]
  );

  const onClickSaveNewActionProfitRow = useCallback(async () => {
    const findQuantity = actionProfitPricingTableRows.find(
      (item) => item.quantity == pricingListRowState.quantity
    );
    if (findQuantity) {
      setSnackbarStateValue({
        state: true,
        message: "This quantity already exists", //TODO:
        type: "error",
      });
    } else {
      const res = await callApi(
        "POST",
        `/v1/printhouse-config/profits/add-action-profit-row`,
        {
          actionId: selectedAction?.id,
          productId: productTest.id,
          quantity: pricingListRowState.quantity,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getActionProfits();
        console.log("selectedAction", selectedAction);
        await getAndSetPricingListTableRows(
          callApi,
          setActionProfitPricingTableRows,
          {
            actionId: selectedAction.id,
            productId: productTest.id,
            ...(actionExceptionProfitIdValue?.id?.length && {
              exceptionId: actionExceptionProfitIdValue.id,
            }),
          }
        );
        setPricingListRowState({});
        setOpenAddNewPricingStepRow(false);
        onCloseAddQuantityModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    }
  }, [
    pricingListRowState,
    selectedAction,
    actionProfitRowsNew,
    productTest,
    actionProfitPricingTableRows,
    selectTestDataVal,
    actionExceptionProfitIdValue,
  ]);

  const onChangeAddPricingListRow = useCallback(
    (key: string, value: any) => {
      setPricingListRowState((prevState: any) => {
        return {
          ...prevState,
          [key]: value,
        };
      });
    },
    [pricingListRowState]
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
    updateActionProfitRow,
    deleteActionProfitRow,
    onClickSaveNewActionProfitRow,
    onChangeAddPricingListRow,
    updateActionProfit,
  };
};

export { useProfitsProfitsFunction };
