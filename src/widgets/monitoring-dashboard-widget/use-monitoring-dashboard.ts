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
  getDailyDocumentsSummaryApi,
} from "@/services/api-service/reports-service/sales-controller-endpoints";
import { useRecoilValue } from "recoil";
import { dashboardDateState, systemCurrencyState } from "@/store";
import { ChartItem } from "./interfaces/charts";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { selectedAgentIdsState } from "./filters/states/selected-agent-id";
import { selectedProductsIdsState } from "./filters/states/selected-product-id";
import { selectedProductTypesIdsState } from "./filters/states/selected-product-type-id";
import { selectedClientTypesIdsState } from "./filters/states/selected-client-types-ids";
import { selectedJobTypesIdsState } from "./filters/states/selected-job-types-ids";
import { startOfMonth, endOfMonth } from "date-fns";
import { selectedDashClientState } from "./filters/states/selected-client-id";
import { selectedDataTypeState } from "./filters/states/selected-data-type";
import { selectedDocumentTypeState } from "./filters/states/selected-document-type";
import { selectedDocumentStatusesState } from "./filters/states/selected-document-statuses";
import { selectedProductionStatusesState } from "./filters/states/selected-production-statuses";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import {
  DocumentTypeEnums,
  INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID,
} from "@/enums/document-type-enum";

type TableRow = [
  string, // clientName or AgentName or ProductName
  string, // totalJobs (formatted)
  string, // quantity (formatted)
  string, // finalPrice (formatted)
  string, // totalCalculatedPrice (formatted)
  string, // totalCost (formatted)
  string, // totalProfit (formatted)
  string, // avgProfit (formatted)
  string, // profitMargin (formatted)
  string, // avgPerOrder (formatted)
  string, // os (formatted)
  string, // successRate (formatted)
  any // growth (JSX element or string)
];

const useMonitoringDashboard = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { getCurrencyUnitText } = useQuoteGetData();
  const { primaryColor } = useGomakeTheme();
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
  const [dailyDocumentsSummary, setDailyDocumentsSummary] = useState<
    {
      date: string;
      ordersUnits: number;
      ordersTotal: number;
      deliveryNotesTotal: number;
      invoiceTotal: number;
    }[]
  >([]);
  const systemCurrency = useRecoilValue<any>(systemCurrencyState);
  const currUnit = getCurrencyUnitText(systemCurrency);

  // const formatDateOnly = (date: Date) => {
  //   return (
  //     date.getFullYear() +
  //     "-" +
  //     String(date.getMonth() + 1).padStart(2, "0") +
  //     "-" +
  //     String(date.getDate()).padStart(2, "0")
  //   );
  // };

  const convertUtcToLocalIsoString = (utcString: string): string => {
    try {
      const date = new Date(utcString); // Correct: Don't add "Z"
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().split("T")[0]; // Return only "YYYY-MM-DD"
    } catch (e) {
      return utcString;
    }
  };

  // Helper function to filter document statuses based on document type
  // Order/Quote only support status 1 and 2, so filter out status 3
  const getFilteredDocumentStatuses = (
    documentType: DocumentTypeEnums | null,
    documentStatuses: number[] | undefined
  ): number[] | undefined => {
    if (!documentStatuses?.length) return undefined;

    if (
      documentType === DocumentTypeEnums.Order ||
      documentType === DocumentTypeEnums.Quote
    ) {
      // Filter out status 3 (PartialClosed) for Order/Quote
      const filtered = documentStatuses.filter((id) => id !== 3);
      return filtered.length > 0 ? filtered : undefined;
    }

    return documentStatuses;
  };

  // Helper function to get production status only if document type is Order
  const getFilteredProductionStatus = (
    documentType: DocumentTypeEnums | null,
    productionStatuses: number[] | undefined
  ): number[] | undefined => {
    if (
      documentType === DocumentTypeEnums.Order &&
      productionStatuses?.length
    ) {
      return productionStatuses;
    }
    return undefined;
  };

  const getSalesChartRoute = async (
    filters,
    extraCostData?: { actualCost?: number; target?: number }
  ) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),

      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),

      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
      ...extraCostData,
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

  const getPieProductTypeChart = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };

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
    await getPieProductTypeChartApi(callApi, callBack, data);
  };

  const getProductPerformanceChart = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        const mapData = data?.map((row) => [
          row?.productName,
          row?.totalJobs?.toLocaleString("en-US") || "0",
          row?.qunatites?.toLocaleString("en-US") || "0",
          row?.finalPrice != null
            ? `${currUnit} ${row.finalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCalculatedPrice != null
            ? `${currUnit} ${row.totalCalculatedPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCost != null
            ? `${currUnit} ${row.totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalProfit != null
            ? `${currUnit} ${row.totalProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.avgProfit != null
            ? `${currUnit} ${row.avgProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.finalPrice
            ? `${((row?.totalProfit / row.finalPrice) * 100).toFixed(2)}%`
            : "0.00%",
          row?.avgPerOrder?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00",
          row?.os != null ? `${row.os.toFixed(2)}%` : "-",
          row?.successRate != null ? `${row.successRate.toFixed(2)}%` : "-",
          typeof row?.growth === "number"
            ? // Render badge via JSX in table cell
              require("react").createElement(
                require("./growth-badge").GrowthBadge,
                { value: row.growth }
              )
            : "-",
        ]);
        setProductsRow(mapData);
      }
    };
    await getProductPerformanceChartApi(callApi, callBack, data);
  };

  const getAgentPerformanceChart = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };

    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        const mapData = data?.map((row) => [
          row?.agentName,
          row?.totalJobs?.toLocaleString("en-US") || "0",
          row?.qunatites?.toLocaleString("en-US") || "0",
          row?.finalPrice != null
            ? `${currUnit} ${row.finalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCalculatedPrice != null
            ? `${currUnit} ${row.totalCalculatedPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCost != null
            ? `${currUnit} ${row.totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalProfit != null
            ? `${currUnit} ${row.totalProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.avgProfit != null
            ? `${currUnit} ${row.avgProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.finalPrice
            ? `${((row?.totalProfit / row.finalPrice) * 100).toFixed(2)}%`
            : "0.00%",
          row?.avgPerOrder?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00",
          row?.os != null ? `${row.os.toFixed(2)}%` : "-",
          row?.successRate != null ? `${row.successRate.toFixed(2)}%` : "-",
          typeof row?.growth === "number"
            ? require("react").createElement(
                require("./growth-badge").GrowthBadge,
                { value: row.growth }
              )
            : "-",
        ]);
        setAgentsRow(mapData);
      }
    };
    await getAgentPerformanceChartApi(callApi, callBack, data);
  };

  const getClientPerformanceChart = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };

    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        const mapData = data?.map((row) => [
          row?.clientName,
          row?.totalJobs?.toLocaleString("en-US") || "0",
          row?.qunatites?.toLocaleString("en-US") || "0",
          row?.finalPrice != null
            ? `${currUnit} ${row.finalPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCalculatedPrice != null
            ? `${currUnit} ${row.totalCalculatedPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalCost != null
            ? `${currUnit} ${row.totalCost.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.totalProfit != null
            ? `${currUnit} ${row.totalProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.avgProfit != null
            ? `${currUnit} ${row.avgProfit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "-",
          row?.finalPrice
            ? `${((row?.totalProfit / row.finalPrice) * 100).toFixed(2)}%`
            : "0.00%",
          row?.avgPerOrder?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || "0.00",
          row?.os != null ? `${row.os.toFixed(2)}%` : "-",
          row?.successRate != null ? `${row.successRate.toFixed(2)}%` : "-",
          typeof row?.growth === "number"
            ? require("react").createElement(
                require("./growth-badge").GrowthBadge,
                { value: row.growth }
              )
            : "-",
        ]);
        setClientsRow(mapData);
      }
    };
    await getClientPerformanceChartApi(callApi, callBack, data);
  };

  const getPieAgentChart = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };
    const callBack = (res) => {
      if (res.success) {
        const data = res.data;
        setAgentChartData(
          data?.map((product) => ({
            label: product?.agentName ?? t("dashboard.noAgent"),
            value: product?.totalPrice,
          }))
        );
      }
    };
    await getPieAgentChartApi(callApi, callBack, data);
  };

  const getDailyDocumentsSummary = async (filters) => {
    const isSpecialOption =
      filters?.selectedDocumentType ===
      INVOICE_AND_OPEN_DELIVERY_NOTES_AND_ORDERS_ID;

    const data: any = {
      fromDate: convertUtcToLocalIsoString(filters?.startDate),
      toDate: convertUtcToLocalIsoString(filters?.endDate),
      ...(filters.selectedAgentIds?.length && {
        agents: filters.selectedAgentIds,
      }),
      ...(filters.selectedProductsIds?.length && {
        products: filters.selectedProductsIds,
      }),
      ...(filters.selectedProductTypesIds?.length && {
        productTypes: filters.selectedProductTypesIds,
      }),
      ...(filters.selectedClientTypesIds?.length && {
        clentTypes: filters.selectedClientTypesIds,
      }),
      ...(filters.selectedJobTypesIds?.length && {
        sourceTypes: filters.selectedJobTypesIds,
      }),
      ...(filters.selectedClient?.id && {
        clients: [filters.selectedClient.id],
      }),
      ...(filters?.selectedDataType !== null && {
        dataType: filters.selectedDataType,
      }),
      ...(isSpecialOption
        ? { isInvoiceAndOpenDeliveryNotesAndOrders: true }
        : filters?.selectedDocumentType !== null && {
            documentType: filters.selectedDocumentType,
          }),
      ...(!isSpecialOption &&
        getFilteredDocumentStatuses(
          filters?.selectedDocumentType,
          filters?.selectedDocumentStatuses
        ) && {
          documentStatuses: getFilteredDocumentStatuses(
            filters?.selectedDocumentType,
            filters?.selectedDocumentStatuses
          ),
        }),
      ...(!isSpecialOption &&
        getFilteredProductionStatus(
          filters?.selectedDocumentType,
          filters?.selectedProductionStatuses
        ) && {
          productionStatus: getFilteredProductionStatus(
            filters?.selectedDocumentType,
            filters?.selectedProductionStatuses
          ),
        }),
    };
    const callBack = (res) => {
      if (res.success) {
        setDailyDocumentsSummary(res.data || []);
      }
    };
    await getDailyDocumentsSummaryApi(callApi, callBack, data);
  };

  const baseTableHeaders = [
    t("dashboard.jobs"),
    t("dashboard.quantity"),
    t("dashboard.finalPrice"),
    t("dashboard.calculatedPrice"),
    t("dashboard.cost"),
    t("dashboard.profit"),
    t("dashboard.avgProfit"),
    t("dashboard.profitMargin"),
    t("dashboard.avgPerOrder"),
    t("dashboard.os"),
    t("dashboard.successRate"),
    t("dashboard.growth"),
  ];

  const productTableHeaders = [t("dashboard.productName"), ...baseTableHeaders];
  const clientTableHeaders = [t("dashboard.clientName"), ...baseTableHeaders];
  const agentTableHeaders = [t("dashboard.agentName"), ...baseTableHeaders];

  const { dates } = useRecoilValue(dashboardDateState);
  const selectedClientTypesIds = useRecoilValue(selectedClientTypesIdsState);
  const selectedJobTypesIds = useRecoilValue(selectedJobTypesIdsState);
  const selectedAgentIds = useRecoilValue(selectedAgentIdsState);
  const selectedProductsIds = useRecoilValue(selectedProductsIdsState);
  const selectedProductTypesIds = useRecoilValue(selectedProductTypesIdsState);
  const selectedClient = useRecoilValue(selectedDashClientState);
  const selectedDataType = useRecoilValue(selectedDataTypeState);
  const selectedDocumentType = useRecoilValue(selectedDocumentTypeState);
  const selectedDocumentStatuses = useRecoilValue(
    selectedDocumentStatusesState
  );
  const selectedProductionStatuses = useRecoilValue(
    selectedProductionStatusesState
  );

  const filters = useMemo(
    () => ({
      startDate: dates?.startDate || startOfMonth(new Date()),
      endDate: dates?.endDate || endOfMonth(new Date()),
      selectedAgentIds,
      selectedProductsIds,
      selectedProductTypesIds,
      selectedClientTypesIds,
      selectedJobTypesIds,
      selectedClient,
      selectedDataType,
      selectedDocumentType,
      selectedDocumentStatuses,
      selectedProductionStatuses,
    }),
    [
      dates?.startDate,
      dates?.endDate,
      selectedAgentIds,
      selectedProductsIds,
      selectedProductTypesIds,
      selectedClientTypesIds,
      selectedJobTypesIds,
      selectedClient,
      selectedDataType,
      selectedDocumentType,
      selectedDocumentStatuses,
      selectedProductionStatuses,
    ]
  );

  const [visibleAgentRows, setVisibleAgentRows] = useState<number>(10);
  const [visibleProductRows, setVisibleProductRows] = useState<number>(10);
  const [visibleClientRows, setVisibleClientRows] = useState<number>(10);

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
    getDailyDocumentsSummary,
    dailyDocumentsSummary,
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
    selectedClientTypesIds,
    selectedJobTypesIds,
    selectedDocumentType,
    selectedDocumentStatuses,
    filters,
    currUnit,
    selectedClient,
    selectedDataType,
    visibleAgentRows,
    setVisibleAgentRows,
    visibleProductRows,
    setVisibleProductRows,
    visibleClientRows,
    setVisibleClientRows,
    primaryColor,
  };
};

export { useMonitoringDashboard };
