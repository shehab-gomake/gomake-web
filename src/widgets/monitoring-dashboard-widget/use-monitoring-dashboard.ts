import { useState } from "react";

import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import {
  getAgentPerformanceChartApi,
  getPieAgentChartApi,
  getPieProductTypeChartApi,
  getProductPerformanceChartApi,
  getSalesChartRouteApi,
} from "@/services/api-service/reports-service/sales-controller-endpoints";
import { useRecoilValue } from "recoil";
import { dashboardDateState } from "@/store";

const useMonitoringDashboard = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { dates } = useRecoilValue(dashboardDateState);
  const [statistics, setStatistics] = useState();

  const [productTypeChartData, setProductTypeChartData] = useState<
    {
      label: string;
      value: number;
    }[]
  >();

  const [agentChartData, setAgentChartData] = useState<
    {
      label: string;
      value: number;
    }[]
  >();

  const [salesItems, setSalesItems] = useState<
    {
      date: string;
      totalCost: number;
      totalPrice: number;
      avgTotalPrice: number;
    }[]
  >();

  const getSalesChartRoute = async (fromDate?: Date, toDate?: Date) => {
    const data = {
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString(),
    };
    const callBack = (res) => {
      if (res.success) {
        const { salesItems, ...statisticsRest } = res.data;
        setStatistics(statisticsRest);
        setSalesItems(salesItems);
      }
    };
    await getSalesChartRouteApi(callApi, callBack, data);
  };

  const getPieProductTypeChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        setProductTypeChartData(
          data?.map((product) => ({
            label: product?.productType,
            value: product?.totalPrice,
          }))
        );
      }
    };
    await getPieProductTypeChartApi(callApi, callBack);
  };

  const getProductPerformanceChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
      }
    };
    await getProductPerformanceChartApi(callApi, callBack);
  };

  const getAgentPerformanceChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
      }
    };
    await getAgentPerformanceChartApi(callApi, callBack);
  };

  const getPieAgentChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        setAgentChartData(
          data?.map((product) => ({
            label: product?.agentName,
            value: product?.totalPrice,
          }))
        );
      }
    };
    await getPieAgentChartApi(callApi, callBack);
  };

  return {
    t,
    statistics,
    getPieProductTypeChart,
    productTypeChartData,
    getSalesChartRoute,
    getProductPerformanceChart,
    getAgentPerformanceChart,
    getPieAgentChart,
    agentChartData,
    salesItems,
    dates,
  };
};

export { useMonitoringDashboard };
