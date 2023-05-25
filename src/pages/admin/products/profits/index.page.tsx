import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profitsState } from "./store/profits";
import { useProfits } from "./use-profits";
import { useEffect } from "react";
import { SelectAction } from "./widgets/select-action";
import { ProductList } from "./widgets/products-list";
import { PricingList } from "./widgets/pricing-list/pricing-list";
import { useStyle } from "./style";
import { Exceptions } from "./widgets/exceptions/exceptions";
import { actionProfitLists } from "@/store";
import { productTestState } from "@/store/product-test";

export default function Profits() {
  const setProfitsState = useSetRecoilState<any>(profitsState);
  const {
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
    openAddNewPricingStepRow,
    pricingListRowState,
    openAddTestProductModal,
    state,
    selectedExceptionProfit,
    openDeleteExceptionProfitModal,
    istimeOutForProductsTest,
    testProductsState,
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
  } = useProfits();
  useEffect(() => {
    setProfitsState({
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
      openAddNewPricingStepRow,
      pricingListRowState,
      openAddTestProductModal,
      state,
      selectedExceptionProfit,
      openDeleteExceptionProfitModal,
      istimeOutForProductsTest,
      testProductsState,
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
    });
  }, [
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
    openAddNewPricingStepRow,
    pricingListRowState,
    openAddTestProductModal,
    state,
    selectedExceptionProfit,
    openDeleteExceptionProfitModal,
    istimeOutForProductsTest,
    testProductsState,
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
  ]);
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(actionProfitLists);
  const productTest = useRecoilValue<any>(productTestState);
  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.profits.admin.title")} />
        <SelectAction />
        {profitsStateValue.id ? (
          <>
            <ProductList />
            {productTest?.id && (
              <div style={clasess.pricingAndExceptionsCointaner}>
                <div style={clasess.pricingCointaner}>
                  <PricingList tableHeaders={tabelPricingHeaders} />
                </div>
                <div style={clasess.exceptionsCointaner}>
                  <Exceptions
                    tableHeaders={tabelExceptionsHeaders}
                    tableRows={profitsStateValue?.actionExpectionRowsMapped}
                  />
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </AdminAuthLayout>
  );
}
