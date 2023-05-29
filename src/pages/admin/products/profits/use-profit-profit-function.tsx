import { useGomakeAxios } from "@/hooks";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

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
}: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
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
      getActionProfits();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [selectedAction, editPriceListStateValue, actionProfits]);
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
        getActionProfits();
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

  const onClickSaveNewActionProfitRow = useCallback(async () => {
    console.log("actionProfitRowsNew", actionProfitRowsNew);
    console.log("pricingListRowState.quantity", pricingListRowState.quantity);

    const findQuantity = actionProfitRowsNew.find(
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
  }, [pricingListRowState, selectedAction, actionProfitRowsNew]);

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
