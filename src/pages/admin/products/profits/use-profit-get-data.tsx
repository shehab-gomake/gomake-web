import { useGomakeAxios } from "@/hooks";
import {
  getAndSetActionExceptionProfitRowByActionExceptionId,
  getAndSetActionProfitRowByActionId,
  getAndSetActionProfitRowChartData,
  getAndSetActions,
  getAndSetClientTypes,
  getAndSetGetAllTestProductsByActionId,
  getAndSetMachinces,
  getAndSetParameters,
  getAndSetProducts,
} from "@/services/hooks";
import {
  actionExceptionProfitId,
  actionLists,
  actionProfitLists,
  actionProfitRows,
  actionProfitRowsState,
  chartDataByActionProfitRow,
  clientTypesState,
  machincesState,
  parametersState,
  productsState,
  selectTestDataState,
} from "@/store";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { renderProfits } from "./use-profit-action.";
import { PricingListMenuWidget } from "./widgets/pricing-list/more-circle";

const useProfitsGetData = () => {
  const router: any = useRouter();
  const [testProductsState, setTestProductsState] = useState([]);
  const [selectedAction, setSelectedAction] = useState<any>({});
  const [productsStateValue, setProductsState] =
    useRecoilState<any>(productsState);
  const [machincesStateValue, setMachincesState] =
    useRecoilState<any>(machincesState);
  const [actionExceptionProfitRowsVal, setActionExceptionProfitRows] =
    useRecoilState<any>(actionProfitRows);
  const [selectTestDataVal, setSelectTestData] =
    useRecoilState<any>(selectTestDataState);
  const [actionProfitRowsNew, setActionProfitRowsNew] = useRecoilState<any>(
    actionProfitRowsState
  );
  const setChartDataValue = useSetRecoilState<any>(chartDataByActionProfitRow);
  const [actionExceptionProfitIdValue, setactionExceptionProfitId] =
    useRecoilState<any>(actionExceptionProfitId);

  const [actionProfits, setActionProfits] =
    useRecoilState<any>(actionProfitLists);

  const [allActions, setAllActions] = useRecoilState(actionLists);
  const [parametersStateValue, setParametersState] =
    useRecoilState<any>(parametersState);
  const [clientTypesStateValue, setClientTypesState] =
    useRecoilState<any>(clientTypesState);
  const { callApi } = useGomakeAxios();
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
        ...(actionExceptionProfitIdValue?.id?.length && {
          exceptionId: actionExceptionProfitIdValue.id,
        }),
      }
    );
  };

  const getActionExceptionProfitRowByActionExceptionId =
    useCallback(async () => {
      // setActionProfitRowsNew("");
      let data = await getAndSetActionExceptionProfitRowByActionExceptionId(
        callApi,
        () => {},
        {
          ActionExceptionId: actionExceptionProfitIdValue,
        }
      );
      const mapData = data?.map((item: any) => {
        return {
          ...renderProfits(item),
          // testFinalPrice: (
          //   item?.quantity * selectTestDataVal?.unitPrice
          // )?.toFixed(2),
          more: <PricingListMenuWidget item={item} />,
          id: item?.id,
        };
      });
      setActionProfitRowsNew(mapData);
    }, [actionExceptionProfitIdValue, selectTestDataVal]);

  const getActionProfitRowChartData = useCallback(async () => {
    await getAndSetActionProfitRowChartData(
      callApi,
      setChartDataValue,
      {
        actionProfitId: actionProfits?.id,
        ...(actionExceptionProfitIdValue?.id?.length && {
          exceptionId: actionExceptionProfitIdValue.id,
        }),
      },
      actionProfits?.pricingBy
    );
  }, [actionProfits, actionExceptionProfitIdValue]);

  const getMachincesProfits = useCallback(async () => {
    await getAndSetMachinces(callApi, setMachincesState);
  }, []);
  const getProducts = useCallback(async () => {
    await getAndSetProducts(callApi, setProductsState);
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
  }, [selectedAction, productsStateValue, router]);

  return {
    router,
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
    setTestProductsState,
    setactionExceptionProfitId,
    getActionProfitRowChartData,
    getActionExceptionProfitRowByActionExceptionId,
    getActionProfits,
    getClientTypes,
    getActions,
    getParameters,
    setAllActions,
    setActionProfits,
    setChartDataValue,
    setActionProfitRowsNew,
    setSelectTestData,
    setActionExceptionProfitRows,
    setMachincesState,
    setProductsState,
    setSelectedAction,
    getMachincesProfits,
    getProducts,
    getTestProducts,
  };
};

export { useProfitsGetData };
