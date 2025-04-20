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

const useMonitoringDashboard = () => {
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

  const [statistics, setStatistics] = useState();

  const { t } = useTranslation();

  const { callApi } = useGomakeAxios();

  const getSalesChartRoute = async () => {
    const data = {
      fromDate: "2025-04-11T00:00:00Z",
      toDate: "2025-04-20T23:59:59Z",
    };

    const callBack = (res) => {
      if (res.success) {
        const { salesItems, ...statisticsRest } = res.data;
        setStatistics(statisticsRest);
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
  };
};

export { useMonitoringDashboard };
