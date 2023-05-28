import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useStyle } from "./style";
import { useProfitsGetData } from "./use-profit-get-data";
import { useProfitsExeptionsFunction } from "./use-profit-exeptions-function";
import { useProfitsProfitsFunction } from "./use-profit-profit-function";
import { useProfitsAction } from "./use-profit-action.";

const useProfits = () => {
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
  });

  const {
    testProductState,
    setProductTest,
    onCklickActionProfitTestResultsByActionId,
    onChangeSelectedAction,
    onChangeAddNewTestProduct,
    setTestProductState,
    deleteTestProductResult,
    onClickTestProduct,
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
  ///ROUTER
  useEffect(() => {
    if (
      router?.query?.actionId &&
      allActions?.length > 0 &&
      productsStateValue?.length > 0
    ) {
      const actionName = allActions.find(
        (item) => item.id === router?.query?.actionId
      );
      onChangeSelectedAction(
        {},
        {
          id: router?.query?.actionId,
          isHaveProfits: true,
          name: actionName?.name,
        }
      );

      // setProductTest({});
    }
  }, [router, allActions, productsStateValue]);
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if (
      router?.query?.actionId &&
      selectedAction?.id &&
      actionProfitRowsNew.length > 0 &&
      !isUpdated
    ) {
      const testName = productsStateValue.find(
        (item) => item.id === router?.query?.productId
      );
      onCklickActionProfitTestResultsByActionId(
        router?.query?.productId || "",
        testName?.name
      );
      setIsUpdated(true);
    }
  }, [router, selectedAction, actionProfitRowsNew]);

  const [istimeOutForProductsTest, setIsTimeOutForProductsTest] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOutForProductsTest(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  const { t } = useTranslation();

  const [openAddTestProductModal, setOpenAddTestProductModal] = useState(false);

  const { clasess } = useStyle();

  useEffect(() => {
    getActionProfitRowChartData();
  }, [actionProfits]);

  useEffect(() => {
    getActions();
    getMachincesProfits();
    getProducts();
    getParameters();
    getClientTypes();
  }, []);

  useEffect(() => {
    if (selectedAction?.id && productsStateValue?.length) {
      getActionProfits();
      getTestProducts();
    }
  }, [selectedAction, router, productsStateValue]);

  useEffect(() => {
    let isQuantity = false;
    actionProfits?.actionProfitRowsMapped?.forEach((element) => {
      if (element.hasOwnProperty("quantity")) {
        isQuantity = true;
        return;
      }
    });
    setTabelPricingHeaders([
      // ...(isQuantity
      //   ? [t("products.profits.pricingListWidget.quantity")]
      //   : [
      //       t("products.profits.pricingListWidget.width"),
      //       t("products.profits.pricingListWidget.height"),
      //     ]),
      t("products.profits.pricingListWidget.cost"),
      t("products.profits.pricingListWidget.profit"),
      t("products.profits.pricingListWidget.testQuantity"),
      t("products.profits.pricingListWidget.unitPrice"),
      t("products.profits.pricingListWidget.totalPrice"),
      // t("products.profits.pricingListWidget.testFinalPrice"),
      // t("products.profits.pricingListWidget.meterPrice"),
      // t("products.profits.pricingListWidget.expMeter"),
      // t("products.profits.pricingListWidget.price"),
      // t("products.profits.pricingListWidget.more"),
    ]);
  }, [actionProfits]);

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
