import { useMemo, useState } from "react";
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
import { dashboardDateState, systemCurrencyState } from "@/store";
import { ChartItem } from "./interfaces/charts";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { selectedAgentIdsState } from "./filters/states/selected-agent-id";
import { selectedProductsIdsState } from "./filters/states/selected-product-id";
import { selectedProductTypesIdsState } from "./filters/states/selected-product-type-id";

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
  const { getCurrencyUnitText } = useQuoteGetData();
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
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const currUnit = getCurrencyUnitText(systemCurrency);

  const getSalesChartRoute = async (
    fromDate?: Date,
    toDate?: Date,
    selectedAgentIds?: string[],
    selectedProductsIds?: string[],
    selectedProductTypesIds?: string[]
  ) => {
    const data: Record<string, any> = {
      fromDate: fromDate?.toISOString(),
      toDate: toDate?.toISOString(),
    };

    if (selectedAgentIds && selectedAgentIds.length > 0) {
      data.agents = selectedAgentIds;
    }

    if (selectedProductsIds && selectedProductsIds.length > 0) {
      data.products = selectedProductsIds;
    }

    if (selectedProductTypesIds && selectedProductTypesIds.length > 0) {
      data.productTypes = selectedProductTypesIds;
    }
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
          row?.finalPrice != null ? `${row.finalPrice} ${currUnit}` : "-",
          row?.totalCalculatedPrice != null
            ? `${row.totalCalculatedPrice} ${currUnit}`
            : "-",
          row?.totalCost != null ? `${row.totalCost} ${currUnit}` : "-",
          row?.totalProfit != null ? `${row.totalProfit} ${currUnit}` : "-",
          row?.avgProfit != null ? `${row.avgProfit} ${currUnit}` : "-",
          row?.avgPerOrder,
          row?.os != null ? `${row.os} %` : "-",
          row?.successRate != null ? `${row.successRate} %` : "-",
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
          row?.finalPrice != null ? `${row.finalPrice} ${currUnit}` : "-",
          row?.totalCalculatedPrice != null
            ? `${row.totalCalculatedPrice} ${currUnit}`
            : "-",
          row?.totalCost != null ? `${row.totalCost} ${currUnit}` : "-",
          row?.totalProfit != null ? `${row.totalProfit} ${currUnit}` : "-",
          row?.avgProfit != null ? `${row.avgProfit} ${currUnit}` : "-",
          row?.avgPerOrder,
          row?.os != null ? `${row.os} %` : "-",
          row?.successRate != null ? `${row.successRate} %` : "-",
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
          row?.finalPrice != null ? `${row.finalPrice} ${currUnit}` : "-",
          row?.totalCalculatedPrice != null
            ? `${row.totalCalculatedPrice} ${currUnit}`
            : "-",
          row?.totalCost != null ? `${row.totalCost} ${currUnit}` : "-",
          row?.totalProfit != null ? `${row.totalProfit} ${currUnit}` : "-",
          row?.avgProfit != null ? `${row.avgProfit} ${currUnit}` : "-",
          row?.avgPerOrder,
          row?.os != null ? `${row.os} %` : "-",
          row?.successRate != null ? `${row.successRate} %` : "-",
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

  const { dates } = useRecoilValue(dashboardDateState);

  const selectedAgentIds = useRecoilValue(selectedAgentIdsState);
  const selectedProductsIds = useRecoilValue(selectedProductsIdsState);
  const selectedProductTypesIds = useRecoilValue(selectedProductTypesIdsState);

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
    systemCurrency,
    selectedAgentIds,
    selectedProductsIds,
    selectedProductTypesIds,
  };
};

export { useMonitoringDashboard };
