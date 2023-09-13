import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const useProfitsEffects = ({
  router,
  allActions,
  productsStateValue,
  onChangeSelectedAction,
  selectedAction,
  actionProfitRowsNew,
  onCklickActionProfitTestResultsByActionId,
  getActionProfitRowChartData,
  actionProfits,
  getActions,
  // getMachincesProfits,
  getProducts,
  getParameters,
  getClientTypes,
  getActionProfits,
  getTestProducts,
  setTabelPricingHeaders,
}) => {
  const { t } = useTranslation();
  const [isUpdated, setIsUpdated] = useState(false);
  const [istimeOutForProductsTest, setIsTimeOutForProductsTest] =
    useState(false);

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
    }
  }, [router, allActions, productsStateValue]);

  useEffect(() => {
    if (
      router?.query?.actionId &&
      selectedAction?.id &&
      actionProfitRowsNew?.length > 0 &&
      !isUpdated
    ) {
      const testName = productsStateValue.find(
        (item) => item.id === router?.query?.productId
      );
      onCklickActionProfitTestResultsByActionId(
        router?.query?.productId || "",
        testName?.name,
        testName?.id
      );
      setIsUpdated(true);
    }
  }, [router, selectedAction, actionProfitRowsNew]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOutForProductsTest(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getActionProfitRowChartData();
  }, [actionProfits]);

  useEffect(() => {
    getActions();
    // getMachincesProfits();
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
      t("products.profits.pricingListWidget.more"),
    ]);
  }, [actionProfits]);

  return { istimeOutForProductsTest, setIsTimeOutForProductsTest };
};

export { useProfitsEffects };
