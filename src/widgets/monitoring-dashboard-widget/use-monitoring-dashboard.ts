import { useState } from "react";
import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import {
  getAgentPerformanceChartApi,
  getClientPerformanceChartApi,
  getPieAgentChartApi,
  getPieProductTypeChartApi,
  getProductPerformanceChartApi,
  getSalesChartRouteApi,
} from "@/services/api-service/reports-service/sales-controller-endpoints";
import { useRecoilValue } from "recoil";
import { dashboardDateState } from "@/store";
import { ChartItem } from "./interfaces/charts";

type TableRow = [
  string, // clientName or AgentName or ProductName
  number, // totalJobs
  number, // finalPrice
  number, // totalCalculatedPrice
  number, // totalCost
  number, // totalProfit
  number, // avgProfit
  number, // avgPerOrder
  string, // os
  number // successRate
];

const useMonitoringDashboard = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { dates } = useRecoilValue(dashboardDateState);
  const [statistics, setStatistics] = useState();
  const [salesItems, setSalesItems] = useState<
    {
      date: string;
      totalCost: number;
      totalPrice: number;
      avgTotalPrice: number;
    }[]
  >();
  const [productTypeChartData, setProductTypeChartData] =
    useState<ChartItem[]>();
  const [agentChartData, setAgentChartData] = useState<ChartItem[]>();
  const [productsRow, setProductsRow] = useState<TableRow[]>([]);
  const [agentsRow, setAgentsRow] = useState<TableRow[]>([]);
  const [clientsRow, setClientsRow] = useState<TableRow[]>([]);

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
        const mapData = data?.map((row) => [
          row?.productName,
          row?.totalJobs,
          row?.finalPrice,
          row?.totalCalculatedPrice,
          row?.totalCost,
          row?.totalProfit,
          row?.avgProfit,
          row?.avgPerOrder,
          row?.os,
          row?.successRate,
        ]);
        setProductsRow(mapData);
      }
    };
    await getProductPerformanceChartApi(callApi, callBack);
  };

  const getAgentPerformanceChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        const mapData = data?.map((row) => [
          row?.agentName,
          row?.totalJobs,
          row?.finalPrice,
          row?.totalCalculatedPrice,
          row?.totalCost,
          row?.totalProfit,
          row?.avgProfit,
          row?.avgPerOrder,
          row?.os,
          row?.successRate,
        ]);
        setAgentsRow(mapData);
      }
    };
    await getAgentPerformanceChartApi(callApi, callBack);
  };

  const getClientPerformanceChart = async () => {
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        const mapData = data?.map((row) => [
          row?.clientName,
          row?.totalJobs,
          row?.finalPrice,
          row?.totalCalculatedPrice,
          row?.totalCost,
          row?.totalProfit,
          row?.avgProfit,
          row?.avgPerOrder,
          row?.os,
          row?.successRate,
        ]);
        setClientsRow(mapData);
      }
    };
    await getClientPerformanceChartApi(callApi, callBack);
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

  const baseTableHeaders = [
    t("dashboard.jobs"),
    t("dashboard.finalPrice"),
    t("dashboard.calculatedPrice"),
    t("dashboard.cost"),
    t("dashboard.profit"),
    t("dashboard.avgProfit"),
    t("dashboard.avgPerOrder"),
    t("dashboard.os"),
    t("dashboard.successRate"),
  ];

  const productTableHeaders = [t("dashboard.productName"), ...baseTableHeaders];
  const clientTableHeaders = [t("dashboard.clientName"), ...baseTableHeaders];
  const agentTableHeaders = [t("dashboard.agentName"), ...baseTableHeaders];

  return {
    t,
    dates,
    salesItems,
    statistics,
    agentChartData,
    productTypeChartData,
    getSalesChartRoute,
    getPieAgentChart,
    getPieProductTypeChart,
    getProductPerformanceChart,
    getAgentPerformanceChart,
    getClientPerformanceChart,
    productsRow,
    productTableHeaders,
    clientsRow,
    clientTableHeaders,
    agentsRow,
    agentTableHeaders,
  };
};

export { useMonitoringDashboard };
