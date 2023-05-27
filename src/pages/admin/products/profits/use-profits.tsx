import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  actionLists,
  actionExceptionProfitId,
  actionProfitLists,
  actionProfitRows,
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
  chartDataByActionProfitRow,
  actionProfitRowsState,
  selectTestDataState,
} from "@/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";
import {
  getAndSetActionProfitRowByActionId,
  getAndSetActions,
  getAndSetProducts,
  getAndSetMachinces,
  getAndSetParameters,
  getAndSetClientTypes,
  getAndSetActionExceptionProfitRowByActionExceptionId,
  generateCalaculationTestLink,
  getAndSetGetAllTestProductsByActionId,
  getAndSetGetActionProfitTestResultsByActionId,
  getAndSetActionProfitRowChartData,
} from "@/services/hooks";
import { editPriceListState } from "./store/edit-price-list";
import { PricingListMenuWidget } from "./widgets/pricing-list/more-circle";
import { productTestState } from "@/store/product-test";

const useProfits = () => {
  const [istimeOutForProductsTest, setIsTimeOutForProductsTest] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeOutForProductsTest(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);
  const setChartDataValue = useSetRecoilState<any>(chartDataByActionProfitRow);

  const [actionProfitRowsNew, setActionProfitRowsNew] = useRecoilState<any>(
    actionProfitRowsState
  );
  console.log("actionProfitRowsNew", actionProfitRowsNew);
  const [selectTestDataVal, setSelectTestData] =
    useRecoilState<any>(selectTestDataState);

  const [machincesStateValue, setMachincesState] =
    useRecoilState<any>(machincesState);
  const [productsStateValue, setProductsState] =
    useRecoilState<any>(productsState);
  const [parametersStateValue, setParametersState] =
    useRecoilState<any>(parametersState);
  const [clientTypesStateValue, setClientTypesState] =
    useRecoilState<any>(clientTypesState);
  const { setSnackbarStateValue } = useSnackBar();
  const [editPriceListStateValue, setEditPriceListState] =
    useRecoilState<any>(editPriceListState);

  const setActionExceptionProfitRows = useSetRecoilState<any>(actionProfitRows);
  const [actionExceptionProfitIdValue, setactionExceptionProfitId] =
    useRecoilState<any>(actionExceptionProfitId);

  const [testProductsState, setTestProductsState] = useState();
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [selectedAction, setSelectedAction] = useState<any>({});
  const [openAddExceptionModal, setOpenAddExceptionModal] = useState(false);
  const [openAddQuantityModal, setOpenAddQuantityModal] = useState(false);
  const onCloseAddQuantityModal = () => {
    setOpenAddQuantityModal(false);
  };
  const onOpenAddQuantityModal = () => {
    setOpenAddQuantityModal(true);
  };

  const [openAddNewPricingStepRow, setOpenAddNewPricingStepRow] =
    useState(false);
  const [pricingListRowState, setPricingListRowState] = useState<any>({});
  const [openAddTestProductModal, setOpenAddTestProductModal] = useState(false);
  const [testProductState, setTestProductState] = useState<any>({});
  const [openDeleteExceptionProfitModal, setOpenDeleteExceptionProfitModal] =
    useState(false);
  const [selectedExceptionProfit, setSelectedExceptionProfit] = useState();
  const onCloseDeleteExceptionProfitModal = () => {
    setOpenDeleteExceptionProfitModal(false);
  };
  const [calculationTestLink, setCalculationTestLink] = useState("");
  const onOpenDeleteExceptionProfitModal = (item: any) => {
    setSelectedExceptionProfit(item);
    setOpenDeleteExceptionProfitModal(true);
  };

  const onCloseAddExceptionModal = () => {
    setOpenAddExceptionModal(false);
  };
  const onOpenAddExceptionModal = () => {
    setOpenAddExceptionModal(true);
  };
  const { clasess } = useStyle();
  const [actionProfits, setActionProfits] =
    useRecoilState<any>(actionProfitLists);
  const getActions = useCallback(async () => {
    await getAndSetActions(callApi, setAllActions);
  }, []);
  const getParameters = useCallback(async () => {
    await getAndSetParameters(callApi, setParametersState);
  }, []);

  const getClientTypes = useCallback(async () => {
    await getAndSetClientTypes(callApi, setClientTypesState);
  }, []);

  const getActionProfits = async (withUpdateAction = true) => {
    console.log("selectTestDataVal", selectTestDataVal);
    await getAndSetActionProfitRowByActionId(
      callApi,
      setActionProfits,
      withUpdateAction
        ? setActionExceptionProfitRows
        : (data) => {
            console.log(data);
          },
      setActionProfitRowsNew,
      machincesStateValue,
      productsStateValue,
      clientTypesStateValue,
      parametersStateValue,
      {
        actionId: selectedAction?.id,
        selectTestDataVal,
      }
    );
  };

  const getActionExceptionProfitRowByActionExceptionId =
    useCallback(async () => {
      setActionExceptionProfitRows("");
      await getAndSetActionExceptionProfitRowByActionExceptionId(
        callApi,
        setActionExceptionProfitRows,
        actionProfits,
        {
          ActionExceptionId: actionExceptionProfitIdValue,
        }
      );
    }, [actionExceptionProfitIdValue]);

  const getActionProfitRowChartData = useCallback(async () => {
    await getAndSetActionProfitRowChartData(
      callApi,
      setChartDataValue,
      {
        actionProfitId: actionProfits?.id,
      },
      actionProfits?.pricingBy
    );
  }, [actionProfits]);

  useEffect(() => {
    getActionProfitRowChartData();
  }, [actionProfits]);

  const onCklickActionExceptionProfitRow = useCallback(
    async (id: string) => {
      setActionExceptionProfitRows("");
      await getAndSetActionExceptionProfitRowByActionExceptionId(
        callApi,
        setActionExceptionProfitRows,
        actionProfits,
        {
          ActionExceptionId: id,
        }
      );
      setactionExceptionProfitId(id);
    },
    [actionExceptionProfitIdValue]
  );
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
          cost: item?.cost || "0",
          profit: item?.profit,
          quantity: item?.quantity,
          unitPrice: selectTestDataVal[0].unitPrice,
          totalPrice: item?.cost * (item?.profit / 100),
          testFinalPrice: item?.quantity * selectTestDataVal[0].unitPrice,
          more: <PricingListMenuWidget item={item} />,
          id: item?.id,
        };
      });
      setactionExceptionProfitId(productId);
      setProductTest({ id: productId, name: productName });
      setActionExceptionProfitRows(mapData);
      setActionProfitRowsNew(mapData);
    },
    [selectedAction, actionProfitRowsNew, selectTestDataVal]
  );
  const getMachincesProfits = useCallback(async () => {
    await getAndSetMachinces(callApi, setMachincesState);
  }, []);
  const getProducts = useCallback(async () => {
    await getAndSetProducts(callApi, setProductsState);
  }, []);
  const onChangeSelectedAction = useCallback(async (e: any, value: any) => {
    setSelectedAction(value);
    setProductTest({});
  }, []);
  const getTestProducts = useCallback(async () => {
    await getAndSetGetAllTestProductsByActionId(
      callApi,
      setTestProductsState,
      productsStateValue,
      {
        actionId: selectedAction?.id,
      }
    );
  }, [selectedAction]);

  useEffect(() => {
    getActions();
    getMachincesProfits();
    getProducts();
    getParameters();
    getClientTypes();
  }, []);
  useEffect(() => {
    getActionProfits();
    getTestProducts();
  }, [selectedAction]);

  const tabelPricingHeaders = useMemo(() => {
    let isQuantity = false;
    actionProfits?.actionProfitRowsMapped?.forEach((element) => {
      if (element.hasOwnProperty("quantity")) {
        isQuantity = true;
        return;
      }
    });
    return [
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
      t("products.profits.pricingListWidget.testFinalPrice"),
      // t("products.profits.pricingListWidget.meterPrice"),
      // t("products.profits.pricingListWidget.expMeter"),
      // t("products.profits.pricingListWidget.price"),
      t("products.profits.pricingListWidget.more"),
    ];
  }, [actionProfits]);
  const tabelExceptionsHeaders = useMemo(
    () => [
      t("products.profits.exceptions.type"),
      t("products.profits.exceptions.parameter"),
      t("products.profits.exceptions.value"),
      t("products.profits.exceptions.scopeOfChange"),
    ],
    []
  );
  const tabelExceptionsRows = useMemo(
    () => [
      {
        type: "machine",
        parameter: "Color =",
        value: "black",
        scopeOfChange: (
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("products.profits.exceptions.chooseScope")}
            onChange={""}
          />
        ),
      },
      {
        type: "machine",
        property: "Color =",
        value: "black",
        scopeOfChange: (
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("products.profits.exceptions.chooseScope")}
            onChange={""}
          />
        ),
      },
    ],
    []
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
  const updateActionProfitMinPrice = useCallback(
    async (value) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/profits/update-action-profit`,
        {
          printingActionId: actionProfits?.printingActionId,
          id: actionProfits?.id,
          recordID: actionProfits?.recordID,
          minPrice: value,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [actionProfits]
  );

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

  const onClickSaveNewActionProfitRow = useCallback(async () => {
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
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [pricingListRowState, selectedAction]);

  const onClickSaveNewActionExceptionProfitRow = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/add-action-exception-profit-row`,

      {
        actionExpectionId: actionExceptionProfitIdValue,
        size: pricingListRowState?.height * pricingListRowState?.width,
        ...pricingListRowState,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getActionExceptionProfitRowByActionExceptionId();
      setPricingListRowState({}), setOpenAddNewPricingStepRow(false);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [pricingListRowState, actionExceptionProfitIdValue]);

  const onChangeAddNewTestProduct = useCallback(
    (key: string, value: any) => {
      setTestProductState(value);
    },
    [testProductState]
  );

  const onClickTestProduct = useCallback(async () => {
    const data = await generateCalaculationTestLink(
      callApi,
      setCalculationTestLink,
      {
        productId: testProductState || "",
        actionId: selectedAction?.id || "",
      }
    );
    if (data?.url) {
      const fullUrl: any = `https://qa.gomake.co.il${data?.url}`;
      window.location = fullUrl;
    } else if (!data?.url) {
      setSnackbarStateValue({
        state: true,
        message: t("products.profits.testFailed"),
        type: "error",
      });
    }
  }, [testProductState, selectedAction]);

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
  }, [testProductState, selectedAction]);
  const [state, setState] = useState<any>({});
  const onChangeState = (key: any, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };
  const addedNewException = useCallback(async () => {
    let newState = { ...state };
    delete newState?.priceListParameter;
    delete newState?.typeOfException;
    delete newState?.machine;
    delete newState?.subProduct;
    delete newState?.clientType;

    const res = await callApi(
      "POST",
      `/v1/printhouse-config/profits/add-exception-profit`,
      {
        actionProfitId: actionProfits?.id,
        ...newState,
      }
    );
    if (res?.success) {
      if (res?.data?.data?.result?.exceptionType === 1) {
        setActionExceptionProfitRows(
          res?.data?.data?.result?.expectionProfitRows
        );
        setactionExceptionProfitId(res?.data?.data?.result?.id);
      }
      if (res?.data?.data?.result?.exceptionType === 2) {
        setactionExceptionProfitId(res?.data?.data?.result?.id);
        const mapData = res?.data?.data?.result?.expectionProfitRows?.map(
          (item: any) => {
            return {
              // ...(res?.data?.data?.result?.expectionProfitRows?.pricingBy === 1
              //   ? {
              //       width: item?.width,
              //       height: item?.height,
              //     }
              //   : { quantity: item?.quantity }),

              //New Display Data

              cost: item?.cost || "0",
              profit: item?.profit || "0",
              testQuantity: item?.quantity || "0",
              unitPrice: item?.unitPrice || "0",
              totalPrice: item?.totalPrice || "0",
              testFinalPrice: item?.testFinalPrice || "0",

              // meterPrice: item?.meterPrice,
              // expMeter: item?.expMeter,
              // price: item?.price,
              // totalPrice: item?.totalPrice,
              more: <PricingListMenuWidget item={item} />,
              id: item?.id,
              recordID: item?.recordID,
            };
          }
        );
        setActionExceptionProfitRows(mapData);
      }
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      onCloseAddExceptionModal();
      getActionProfits(false);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [state]);
  const deleteExceptionProfit = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-exception-profit?actionExceptionId=${id}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        getActionProfits();
        onCloseDeleteExceptionProfitModal();
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
  const deleteActionExceptionProfitRow = useCallback(
    async (id: string) => {
      const res = await callApi(
        "DELETE",
        `/v1/printhouse-config/profits/delete-action-exception-profit-row?Id=${id}`
      );
      if (res?.success) {
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
    [actionExceptionProfitIdValue]
  );
  const updateActionProfitRow = useCallback(async () => {
    console.log(
      "editPriceListStateValue?.state",
      editPriceListStateValue?.state
    );
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

  const updateActionExceptionProfitRow = useCallback(async () => {
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/profits/update-action-exception-profit-row`,
      {
        ...editPriceListStateValue?.state,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      setEditPriceListState({ isEdit: false });
      getActionExceptionProfitRowByActionExceptionId();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [actionExceptionProfitIdValue, editPriceListStateValue]);
  return {
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
