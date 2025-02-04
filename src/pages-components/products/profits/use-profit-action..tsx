import { useGomakeAxios } from "@/hooks";
import {
  generateCalaculationTestLink,
  getAndSetGetActionProfitTestResultsByActionId,
} from "@/services/hooks";
import { productTestState } from "@/store/product-test";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { actionProfitPricingTableRowsState } from "@/store/action-profit-pricing-table-rows";
import { actionExceptionProfitId, actionProfitLists } from "@/store";

export const renderProfits = (item: any, data: any = {}) => {
  const cost = item?.cost || 0;
  const profit = item?.profit || 0;
  const quantity = item?.quantity || 0;
  const percentProfit = profit / 100;
  const percentExpProfit = data?.expProfit / 100;
  const total = data?.expProfit
    ? cost * (1 + percentExpProfit)
    : cost * (1 + percentProfit);
  const isBaseCaseQuantity = !!item?.isBaseCaseQuantity;

  return {
    cost: Number(cost),
    profit: Number(profit),
    ...(data?.expProfit && { expProfit: data?.expProfit }),
    quantity: Number(quantity),
    unitPrice: Number(total / quantity).toFixed(2),
    totalPrice: Number(total).toFixed(2),
    recordID: item?.recordID,
    status: item?.status,
    isBaseCaseQuantity: isBaseCaseQuantity,
  };
};

const useProfitsAction = ({
  setSelectedAction,
  actionProfitRowsNew,
  setSelectTestData,
  actionProfits,
  selectedAction,
  selectTestDataVal,
  router,
  setSnackbarStateValue,
  getActionExceptionProfitRowByActionExceptionId,
  getTestProducts,
  setTabelPricingHeaders,
}: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const [openAddTestProductModal, setOpenAddTestProductModal] = useState(false);
  const [testProductState, setTestProductState] = useState<any>({});
  const [actionProductId, setActionProductId] = useState<any>({});
  const setProductTest = useSetRecoilState(productTestState);
  const setActionProfitPricingTableRows = useSetRecoilState<any>(
    actionProfitPricingTableRowsState
  );
  const setActionExceptionProfitIdValue = useSetRecoilState<any>(
    actionExceptionProfitId
  );

  const onCklickActionProfitTestResultsByActionId = useCallback(
    async (
      productId: string,
      productName: string,
      actionProductId: string,
      isBaseCase?: boolean
    ) => {
      setActionExceptionProfitIdValue("");
      setTabelPricingHeaders([
        t("products.profits.pricingListWidget.cost"),
        t("products.profits.pricingListWidget.profit"),
        t("products.profits.pricingListWidget.testQuantity"),
        t("products.profits.pricingListWidget.unitPrice"),
        t("products.profits.pricingListWidget.totalPrice"),
        t("products.profits.pricingListWidget.more"),
      ]);
      setActionProfitPricingTableRows("");
      await getAndSetGetActionProfitTestResultsByActionId(
        callApi,
        setActionProfitPricingTableRows,
        setSelectTestData,
        actionProfits,
        {
          actionId: selectedAction?.id,
          productId,
          actionProductId,
        }
      );
      setProductTest({
        id: productId,
        name: productName,
        actionProductId,
        isBaseCase: !!isBaseCase,
      });
    },
    [selectedAction, actionProfitRowsNew, selectTestDataVal]
  );

  const setProfitsStateValue = useSetRecoilState<any>(actionProfitLists);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    if (!value) {
      setProductTest(null);
      setSelectedAction("");
      setProfitsStateValue("");
    } else {
      setSelectedAction(value);
      setProductTest(null);
    }
  }, []);

  const onChangeAddNewTestProduct = useCallback((key: string, value: any) => {
    setTestProductState(value);
  }, []);

  const onClickTestProduct = useCallback(
    async (id) => {
      const data = await generateCalaculationTestLink(callApi, () => {}, {
        productId: id || "",
        actionId: selectedAction?.id || "",
        systemID: 2,
      });
      if (data?.url) {
        const fullUrl: any = `${data?.url}`;
        window.location = fullUrl;
      } else if (!data?.url) {
        setSnackbarStateValue({
          state: true,
          message: t("products.profits.testFailed"),
          type: "error",
        });
      }
    },
    [selectedAction]
  );

  const deleteTestProductResult = useCallback(
    async (item: any) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/products/delete-product-price-test-result?actionId=${selectedAction?.id}&productId=${item?.item?.productId}&actionProductId=${item?.item?.id}`
      );
      if (res?.success) {
        getTestProducts();
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
    [actionProductId, testProductState, selectedAction, router]
  );

  return {
    testProductState,
    openAddTestProductModal,
    setProductTest,
    onCklickActionProfitTestResultsByActionId,
    onChangeSelectedAction,
    onChangeAddNewTestProduct,
    setTestProductState,
    deleteTestProductResult,
    setActionProductId,
    onClickTestProduct,
    setOpenAddTestProductModal,
  };
};

export { useProfitsAction };
