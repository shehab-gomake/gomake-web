import { useGomakeAxios } from "@/hooks";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getDataForAutoPricingActionsChartApi } from "@/services/api-service/quotes/qoutes-endpoints";
import { getAllPrintHouseActions } from "@/services/hooks";
import { getAndSetProfitsPricingTables } from "@/pages-components/products/profits-new/services/get-profits-pricing-tables";
import {
  profitAutoFixApi,
  rollbackUpdatedPricingTablesAfterOptimizationApi,
} from "@/services/api-service/print-houses/profits-auto-calculation";
import { EHttpMethod } from "@/services/api-service/enums";

type ActionOption = {
  actionId: string;
  label: string;
  value: string;
};

export enum ExceptionType {
  Additional = 0,
  NewBase = 1,
  EditBase = 2,
  Default = 3,
}

const usePriceProfit = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  // Set default date range: 6 months ago until now
  const getDefaultDateRange = () => {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    return { from: sixMonthsAgo, to: now };
  };

  const defaultDates = getDefaultDateRange();
  const [fromDate, setFromDate] = useState<Date>(defaultDates.from);
  const [toDate, setToDate] = useState<Date>(defaultDates.to);

  const onSelectDeliveryTimeDates = (value) => {
    if (value && value.length === 2) {
      setFromDate(value[0]);
      setToDate(value[1]);
    } else {
      // Reset to default dates if cleared
      const defaultDates = getDefaultDateRange();
      setFromDate(defaultDates.from);
      setToDate(defaultDates.to);
    }
  };
  const [action, setAction] = useState<ActionOption | null>(null);
  const [actionList, setActionList] = useState<any[]>([]);
  const [profitsPricingTables, setProfitsPricingTables] = useState<any[]>([]);
  const [selectedPricingTable, setSelectedPricingTable] = useState<any>(null);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [excelReportLink, setExcelReportLink] = useState<string | null>(null);
  const [summaryData, setSummaryData] = useState<{
    diffAfterOptimization: number;
    diffBeforeOptimization: number;
    accuracyBeforeOptimization: number;
    accuracyAfterOptimization: number;
    totalPoints: number;
    totalAbnormalPoints: number;
    totalCalculatedPrice: number;
    totalUserInputPrice: number;
    totalFixedPrice: number;
  } | null>(null);

  const [chartData, setChartData] = useState({
    pointsX: [],
    pointsY: [],
    userProfits: [],
    calculatedProfits: [],
    userProfitsCosts: [],
    calculatedProfitsCosts: [],
    abnormalPointsX: [],
    abnormalPointsY: [],
  });

  const getActions = useCallback(async () => {
    await getAllPrintHouseActions(callApi, setActionList);
  }, []);

  const onChangeActionId = (_e: any, option: ActionOption | null) => {
    setAction(option);
    setSelectedPricingTable(null);
  };

  const onSelectPricingTable = (_e: any, option: any) => {
    setSelectedPricingTable(option);
  };

  const getProfitsPricingTablesOld = useCallback(async () => {
    if (action?.actionId) {
      await getAndSetProfitsPricingTables(callApi, setProfitsPricingTables, {
        actionIdOrProductId: action.actionId,
        isOutSource: false,
      });
    }
  }, [action, callApi]);

  //!here check
  const getProfitsPricingTables = useCallback(async () => {
    if (action?.actionId) {
      // Store the current selected pricing table ID before refreshing
      const currentSelectedId = selectedPricingTable?.value;

      const result = await getAndSetProfitsPricingTables(
        callApi,
        setProfitsPricingTables,
        {
          actionIdOrProductId: action.actionId,
          isOutSource: false,
        }
      );

      // Reselect the pricing table by ID if it was previously selected
      if (currentSelectedId && result && Array.isArray(result)) {
        const tableToReselect = result.find(
          (table) => table.id === currentSelectedId
        );
        if (tableToReselect) {
          setSelectedPricingTable(tableToReselect);
        }
      }
    }
  }, [action, callApi]);

  const getDataForAutoPricingActionsChart = async (
    fromDate?: string,
    toDate?: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const rows =
          res?.data?.[0]?.actionChartData &&
          Array.isArray(res.data[0].actionChartData)
            ? res.data[0].actionChartData
            : [];

        // (optional) sort by cost so lines draw left→right
        rows.sort((a, b) => Number(a.cost ?? 0) - Number(b.cost ?? 0));

        const next = {
          calculatedProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          calculatedProfits: rows.map((r) => Number(r.calculatedProfit ?? 0)),

          userProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          userProfits: rows.map((r) => Number(r.userInputProfit ?? 0)),

          fixedProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          fixedProfits: rows.map((r) => Number(r.fixedProfit ?? 0)),

          // 4th line example: cost vs cost (diagonal) — remove if you don't want it
          costLineX: rows.map((r) => Number(r.cost ?? 0)),
          costLineY: rows.map((r) => Number(r.cost ?? 0)),

          // no regression points yet
          pointsX: [],
          pointsY: [],

          // no abnormal points in initial data load
          abnormalPointsX: [],
          abnormalPointsY: [],
        };

        setChartData(next);
        setIsFixed(false);
        setExcelReportLink(null); // Clear the excel report link when getting new data
        setSummaryData(null); // Clear the summary data when getting new data
      }
    };
    await getDataForAutoPricingActionsChartApi(callApi, callBack, {
      fromDate,
      toDate,
      actionId,
      pricingTableId,
    });
  };

  const handleAutoFix = async (
    fromDate?: string,
    toDate?: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        const rows =
          res?.data?.[0]?.actionChartData &&
          Array.isArray(res.data[0].actionChartData)
            ? res.data[0].actionChartData
            : [];

        // (optional) sort by cost so lines draw left→right
        rows.sort((a, b) => Number(a.cost ?? 0) - Number(b.cost ?? 0));

        // Extract abnormal action chart data for scatter points
        const abnormalRows =
          res?.data?.[0]?.abnormalActionChartData &&
          Array.isArray(res.data[0].abnormalActionChartData)
            ? res.data[0].abnormalActionChartData
            : [];

        const next = {
          calculatedProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          calculatedProfits: rows.map((r) => Number(r.calculatedProfit ?? 0)),

          userProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          userProfits: rows.map((r) => Number(r.userInputProfit ?? 0)),

          fixedProfitsCosts: rows.map((r) => Number(r.cost ?? 0)),
          fixedProfits: rows.map((r) => Number(r.fixedProfit ?? 0)),

          // 4th line example: cost vs cost (diagonal) — remove if you don't want it
          costLineX: rows.map((r) => Number(r.cost ?? 0)),
          costLineY: rows.map((r) => Number(r.cost ?? 0)),

          // no regression points yet
          pointsX: [],
          pointsY: [],

          // abnormal action chart data as scatter points
          abnormalPointsX: abnormalRows.map((r) => Number(r.cost ?? 0)),
          abnormalPointsY: abnormalRows.map((r) =>
            Number(r.userInputProfit ?? 0)
          ),
        };

        setChartData(next);
        setIsFixed(true);

        // Store the excelReportLink from the response
        if (res?.data?.[0]?.excelReportLink) {
          setExcelReportLink(res.data[0].excelReportLink);
        }

        // Store the summary data from the response
        if (res?.data?.[0]) {
          // Calculate total points (actionChartData + abnormalActionChartData)
          const totalPoints = (rows?.length || 0) + (abnormalRows?.length || 0);
          // Calculate total abnormal points (abnormalActionChartData)
          const totalAbnormalPoints = abnormalRows?.length || 0;

          setSummaryData({
            diffAfterOptimization: res.data[0].diffAfterOptimization || 0,
            diffBeforeOptimization: res.data[0].diffBeforeOptimization || 0,
            accuracyBeforeOptimization:
              res.data[0].accuracyBeforeOptimization || 0,
            accuracyAfterOptimization:
              res.data[0].accuracyAfterOptimization || 0,
            totalPoints,
            totalAbnormalPoints,
            totalCalculatedPrice: res.data[0].totalCalculatedPrice || 0,
            totalUserInputPrice: res.data[0].totalUserInputPrice || 0,
            totalFixedPrice: res.data[0].totalFixedPrice || 0,
          });
        }

        // Call getProfitsPricingTables after successful fix
        if (action?.actionId) {
          getProfitsPricingTables();
        }
      }
    };
    await profitAutoFixApi(callApi, callBack, {
      fromDate,
      toDate,
      actionId,
      pricingTableId,
    });
  };

  const handleRollback = async (
    fromDate: string,
    toDate: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    const callBack = (res) => {
      if (res?.success) {
        // Call getDataForAutoPricingActionsChart after successful rollback
        getDataForAutoPricingActionsChart(
          fromDate,
          toDate,
          actionId,
          pricingTableId
        );

        // Call getProfitsPricingTables after successful rollback
        if (action?.actionId) {
          getProfitsPricingTables();
        }
      }
    };
    await rollbackUpdatedPricingTablesAfterOptimizationApi(callApi, callBack);
  };

  const exportDataForProfitsByAction = async (
    fromDate?: string,
    toDate?: string,
    actionId?: string,
    pricingTableId?: string
  ) => {
    if (isFixed && excelReportLink) {
      const a = document.createElement("a");
      a.href = excelReportLink;
      a.download = "DataForProfitsByAction_Fixed.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    const res = await callApi(
      EHttpMethod.POST,
      `/v1/erp-service/quote/export-data-for-profits-by-action`,
      {
        fromDate,
        toDate,
        actionId,
        pricingTableId,
      },
      true,
      null,
      "blob"
    );

    const downloadLink = document.createElement("a");
    const link = URL?.createObjectURL(res.data);
    downloadLink.href = link;
    downloadLink.download = `DataForProfitsByAction.xlsx`;
    downloadLink.click();
  };

  return {
    actionList,
    onChangeActionId,
    action,
    onSelectDeliveryTimeDates,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    getDataForAutoPricingActionsChart,
    handleAutoFix,
    handleRollback,
    isFixed,
    summaryData,
    getActions,
    getProfitsPricingTables,
    profitsPricingTables,
    selectedPricingTable,
    onSelectPricingTable,
    chartData,
    exportDataForProfitsByAction,
  };
};

export { usePriceProfit };
