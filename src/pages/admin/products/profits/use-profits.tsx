import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { useProfitsGetData } from "./use-profit-get-data";
import { useProfitsExeptionsFunction } from "./use-profit-exeptions-function";
import { useProfitsProfitsFunction } from "./use-profit-profit-function";
import { useProfitsAction } from "./use-profit-action.";
import { useProfitsEffects } from "./use-profits-effects";

const useProfits = () => {
  const { t } = useTranslation();
  const {
    allActions,
    parametersStateValue,
    actionProfits,
    actionExceptionProfitIdValue,
    actionProfitRowsNew,
    selectTestDataVal,
    actionExceptionProfitRowsVal,
    machincesStateValue,
    productsStateValue,
    selectedAction,
    clientTypesStateValue,
    testProductsState,
    router,
    setactionExceptionProfitId,
    getActionProfitRowChartData,
    getActionExceptionProfitRowByActionExceptionId,
    getActionProfits,
    getClientTypes,
    getActions,
    getParameters,
    setActionProfitRowsNew,
    setSelectTestData,
    setActionExceptionProfitRows,
    setMachincesState,
    setProductsState,
    setSelectedAction,
    getMachincesProfits,
    getProducts,
    getTestProducts,
    setTestProductsState,
  } = useProfitsGetData();

  const {
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
    onChangeState,
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
  } = useProfitsExeptionsFunction({
    actionProfits,
    actionProfitRowsNew,
    selectTestDataVal,
    actionExceptionProfitRowsVal,
    actionExceptionProfitIdValue,
    selectedAction,
    getActionExceptionProfitRowByActionExceptionId,
    getActionProfits,
    setActionExceptionProfitRows,
    setactionExceptionProfitId,
    setActionProfitRowsNew,
  });

  const {
    updateActionProfitRow,
    deleteActionProfitRow,
    onClickSaveNewActionProfitRow,
    onChangeAddPricingListRow,
    updateActionProfit,
  } = useProfitsProfitsFunction({
    getActionProfitRowChartData,
    editPriceListStateValue,
    actionProfits,
    selectedAction,
    pricingListRowState,
    actionProfitRowsNew,
    setSnackbarStateValue,
    setEditPriceListState,
    getActionProfits,
    setPricingListRowState,
    setOpenAddNewPricingStepRow,
    onCloseAddQuantityModal,
    selectTestDataVal,
  });

  const {
    testProductState,
    openAddTestProductModal,
    setProductTest,
    onCklickActionProfitTestResultsByActionId,
    onChangeSelectedAction,
    onChangeAddNewTestProduct,
    setTestProductState,
    deleteTestProductResult,
    onClickTestProduct,
    setOpenAddTestProductModal,
  } = useProfitsAction({
    setSelectedAction,
    actionProfitRowsNew,
    setActionExceptionProfitRows,
    setSelectTestData,
    actionProfits,
    selectedAction,
    setActionProfitRowsNew,
    selectTestDataVal,
    router,
    setSnackbarStateValue,
    getActionExceptionProfitRowByActionExceptionId,
    getTestProducts,
  });

  const { istimeOutForProductsTest } = useProfitsEffects({
    router,
    allActions,
    productsStateValue,
    selectedAction,
    actionProfitRowsNew,
    actionProfits,
    onChangeSelectedAction,
    onCklickActionProfitTestResultsByActionId,
    getActionProfitRowChartData,
    getActions,
    getMachincesProfits,
    getProducts,
    getParameters,
    getClientTypes,
    getActionProfits,
    getTestProducts,
    setTabelPricingHeaders,
  });

  return {
    allActions,
    selectedAction,
    tabelPricingHeaders,
    tabelExceptionsHeaders,
    actionProfits,
    machincesStateValue,
    productsStateValue,
    parametersStateValue,
    clientTypesStateValue,
    openAddExceptionModal,
    openAddNewPricingStepRow,
    pricingListRowState,
    openAddTestProductModal,
    state,
    selectedExceptionProfit,
    openDeleteExceptionProfitModal,
    istimeOutForProductsTest,
    testProductsState,
    openAddQuantityModal,
    selectTestDataVal,
    onCloseAddQuantityModal,
    onOpenAddQuantityModal,
    updateActionProfitMinPrice,
    onCklickActionExceptionProfitRow,
    onCklickActionProfitTestResultsByActionId,
    deleteTestProductResult,
    setTestProductState,
    onClickSaveNewActionExceptionProfitRow,
    updateActionExceptionProfitRow,
    deleteActionExceptionProfitRow,
    updateActionProfitRow,
    deleteActionProfitRow,
    onCloseDeleteExceptionProfitModal,
    onOpenDeleteExceptionProfitModal,
    deleteExceptionProfit,
    setState,
    onChangeState,
    addedNewException,
    onClickTestProduct,
    onChangeAddNewTestProduct,
    setOpenAddTestProductModal,
    onClickSaveNewActionProfitRow,
    onChangeAddPricingListRow,
    setOpenAddNewPricingStepRow,
    updateActionProfit,
    onChangeSelectedAction,
    onCloseAddExceptionModal,
    onOpenAddExceptionModal,
    t,
  };
};

export { useProfits };
