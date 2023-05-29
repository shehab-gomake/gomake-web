import { useGomakeAxios } from "@/hooks";
import {
  generateCalaculationTestLink,
  getAndSetGetActionProfitTestResultsByActionId,
} from "@/services/hooks";
import { productTestState } from "@/store/product-test";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { PricingListMenuWidget } from "./widgets/pricing-list/more-circle";

export const renderProfits = (item: any) => {
  const cost = item?.cost || 0;
  const profit = item?.profit || 0;
  const quantity = item?.quantity || 0;
  const percentProfit = profit / 100;
  const total = cost * (1 + percentProfit);

  return {
    cost: Number(cost),
    profit: Number(profit),
    quantity: Number(quantity),
    unitPrice: Number(total / quantity).toFixed(2),
    totalPrice: Number(total).toFixed(2),
    recordID: item?.recordID,
  };
};

const useProfitsAction = ({
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
}: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  const [openAddTestProductModal, setOpenAddTestProductModal] = useState(false);
  const [testProductState, setTestProductState] = useState<any>({});
  const setProductTest = useSetRecoilState(productTestState);
  const onCklickActionProfitTestResultsByActionId = useCallback(
    async (productId: string, productName: string) => {
      setActionExceptionProfitRows("");
      const selectTestDataVal =
        await getAndSetGetActionProfitTestResultsByActionId(
          callApi,
          setActionExceptionProfitRows,
          setSelectTestData,
          actionProfits,
          {
            actionId: selectedAction?.id,
            productId: productId,
          }
        );
      const mapData = actionProfitRowsNew?.map((item: any) => {
        return {
          ...renderProfits(item),

          // testFinalPrice: (
          //   item?.quantity * selectTestDataVal[0]?.unitPrice
          // )?.toFixed(2),
          more: <PricingListMenuWidget item={item} />,
          id: item?.id,
        };
      });
      // setactionExceptionProfitId(productId);
      setProductTest({ id: productId, name: productName });
      setActionExceptionProfitRows(mapData);
      setActionProfitRowsNew(mapData);
    },
    [selectedAction, actionProfitRowsNew, selectTestDataVal]
  );

  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
    setProductTest({});
  }, []);

  const onChangeAddNewTestProduct = useCallback((key: string, value: any) => {
    setTestProductState(value);
  }, []);

  const onClickTestProduct = useCallback(
    async (id) => {
      const data = await generateCalaculationTestLink(callApi, () => {}, {
        productId: id || "",
        actionId: selectedAction?.id || "",
      });
      if (data?.url) {
        const fullUrl: any = `https://tests.gomake.co.il${data?.url}`;
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

  const deleteTestProductResult = useCallback(async () => {
    const res = await callApi(
      "DELETE",
      `/v1/printhouse-config/products/delete-product-price-test-result?actionId=${selectedAction?.id}&productId=${testProductState}`
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
  }, [testProductState, selectedAction, router]);

  return {
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
  };
};

export { useProfitsAction };
