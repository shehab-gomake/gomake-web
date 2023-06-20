import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { profitsState } from "./store/profits";
import { useProfits } from "./use-profits";
import { useEffect } from "react";
import { SelectAction } from "./widgets/select-action";
import { ProductList } from "./widgets/products-list";
import { PricingList } from "./widgets/pricing-list/pricing-list";
import { useStyle } from "./style";
import { Exceptions } from "./widgets/exceptions/exceptions";
import { actionExceptionProfitId, actionProfitLists } from "@/store";
import { productTestState } from "@/store/product-test";
import { LineChart } from "./widgets/line-chart";

export default function Profits() {
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(actionProfitLists);
  const productTest = useRecoilValue<any>(productTestState);
  const setProfitsState = useSetRecoilState<any>(profitsState);
  const {
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
    updateException,
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
    selectedProfitException,
    openUpdateExceptionModal,
    setOpenUpdateExceptionModal,
    onCloseUpdateExceptionModal,
    onOpenUpdateExceptionModal,
    t,
  } = useProfits();
  useEffect(() => {
    setProfitsState({
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
      updateException,
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
      selectedProfitException,
      openUpdateExceptionModal,
      setOpenUpdateExceptionModal,
      onCloseUpdateExceptionModal,
      onOpenUpdateExceptionModal,
      t,
    });
  }, [
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
    profitsStateValue,
    productTest,
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
    updateException,
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
    selectedProfitException,
    openUpdateExceptionModal,
    setOpenUpdateExceptionModal,
    onCloseUpdateExceptionModal,
    onOpenUpdateExceptionModal,
    t,
  ]);

  const [actionExceptionProfitIdValue, setactionExceptionProfitId] =
    useRecoilState<any>(actionExceptionProfitId);

  useEffect(() => {
    console.log("A");
  });
  return (
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.profits.admin.title")} />
        <SelectAction />
        {profitsStateValue?.id ? (
          <div
            style={{
              display: "flex",
              // gap: 50,
              flexDirection: "column",
              width: "100%",
            }}
          >
            <div style={clasess.titleActionName}>
              {selectedAction?.name} pricing settings
            </div>
            <ProductList />
            {productTest?.id && (
              <div style={clasess.pricingAndExceptionsCointaner}>
                <div style={clasess.pricingCointaner}>
                  <PricingList
                    tableHeaders={tabelPricingHeaders}
                    tablePercent={
                      actionExceptionProfitIdValue?.id?.length > 0
                        ? [
                            "80px",
                            "80px",
                            "80px",
                            "80px",
                            "100px",
                            "100px",
                            "50px",
                          ]
                        : ["80px", "80px", "80px", "100px", "100px", "50px"]
                    }
                  />
                </div>

                <div style={clasess.exceptionsCointaner}>
                  <Exceptions
                    tableHeaders={tabelExceptionsHeaders}
                    tableRows={profitsStateValue?.actionExpectionRowsMapped}
                  />
                </div>
              </div>
            )}
            <div style={{ maxWidth: 600, maxHeight: 300, marginTop: 50 }}>
              <LineChart />
            </div>
          </div>
        ) : null}
      </div>
  );
}
