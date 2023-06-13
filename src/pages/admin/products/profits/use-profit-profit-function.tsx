import { useGomakeAxios } from "@/hooks";
import { getAndSetPricingListTableRows } from "@/services/hooks";
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
  const { t } = useTranslation();
  const [actionProfitPricingTableRows, setActionProfitPricingTableRows] =
    useRecoilState<any>(actionProfitPricingTableRowsState);
  const productTest = useRecoilValue<any>(productTestState);

  const updateActionProfitRow = useCallback(async () => {
    const res = await callApi(
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
      }
    );
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
        { actionId: selectedAction.id, productId: productTest.id }
      );
      getActionProfitRowChartData();
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
          { actionId: selectedAction.id, productId: productTest.id }
        );
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    [selectedAction, productTest]
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
          // size: pricingListRowState?.height * pricingListRowState?.width,
          ...pricingListRowState,
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
          { actionId: selectedAction.id, productId: productTest.id }
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
