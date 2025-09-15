import { useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { useSnackBar } from "./use-snack-bar";
import {
  createScheduledReportApi,
  updateScheduledReportApi,
  getAllScheduledReportsApi,
  deleteScheduledReportApi,
  toggleScheduledReportApi,
  getScheduledReportByIdApi,
  runScheduledReportApi,
  getActiveDueScheduledReportsApi,
} from "@/services/api-service/scheduled-reports/scheduled-reports-api";
import { ScheduleFrequencyEnum, DateRangeTypeEnum, DayOfWeek } from "@/enums/scheduled-reports-enums";

export interface ScheduledReport {
  id: string;
  reportName: string;
  email: string;
  documentType: number;
  frequency: ScheduleFrequencyEnum;
  dateRangeType: DateRangeTypeEnum;
  startDayOfWeek?: DayOfWeek;
  startDayOfMonth?: number;
  reportConfiguration: {
    groupBy: number;
    exceptionConditionProperties: Array<{
      statementId: string;
      operator: string;
      conditionBetweenStatements: string;
      statementCategory: number;
    }>;
    filterDTO: {
      fromDate?: string;
      toDate?: string;
      statusId?: number;
      closeStatus?: number;
      productionStatus?: number;
      patternSearch?: string;
      customerId?: string;
      dateRange?: string;
      agentId?: string;
      minPrice?: string;
      maxPrice?: string;
      productList?: string[];
      isCanceled?: boolean;
      isPaused?: boolean;
      approvalStatus?: number;
      deliveryStatus?: number;
      currency?: string;
      supplierId?: string;
      refund?: boolean;
    };
  };
  isActive: boolean;
  createdAt: string;
}

const useScheduledReports = () => {
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessGetData,
    alertFaultGetData,
    alertSuccessUpdate,
    alertFaultUpdate,
    alertFaultDelete,
    alertSuccessDelete,
  } = useSnackBar();

  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAllScheduledReports = async () => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        setScheduledReports(res.data || []);
        alertSuccessGetData();
      } else {
        alertFaultGetData();
      }
    };
    await getAllScheduledReportsApi(callApi, callBack, {});
    setIsLoading(false);
  };

  const createScheduledReport = async (data: Partial<ScheduledReport>) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getAllScheduledReports(); // Refresh the list
      } else {
        alertFaultUpdate();
      }
    };
    await createScheduledReportApi(callApi, callBack, data);
    setIsLoading(false);
  };

  const updateScheduledReport = async (data: Partial<ScheduledReport>) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getAllScheduledReports(); // Refresh the list
      } else {
        alertFaultUpdate();
      }
    };
    await updateScheduledReportApi(callApi, callBack, data);
    setIsLoading(false);
  };

  const deleteScheduledReport = async (id: string) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete();
        getAllScheduledReports(); // Refresh the list
      } else {
        alertFaultDelete();
      }
    };
    await deleteScheduledReportApi(callApi, callBack, { id });
    setIsLoading(false);
  };

  const toggleScheduledReport = async (id: string, isActive: boolean) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getAllScheduledReports(); // Refresh the list
      } else {
        alertFaultUpdate();
      }
    };
    await toggleScheduledReportApi(callApi, callBack, { id, isActive });
    setIsLoading(false);
  };

  const runScheduledReport = async (id: string, data?: any) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    };
    await runScheduledReportApi(callApi, callBack, { id, ...data });
    setIsLoading(false);
  };

  const getScheduledReportById = async (id: string) => {
    setIsLoading(true);
    let result = null;
    const callBack = (res) => {
      if (res.success) {
        result = res.data;
      } else {
        alertFaultGetData();
      }
    };
    await getScheduledReportByIdApi(callApi, callBack, { id });
    setIsLoading(false);
    return result;
  };

  const getActiveDueScheduledReports = async () => {
    setIsLoading(true);
    let result = [];
    const callBack = (res) => {
      if (res.success) {
        result = res.data || [];
      } else {
        alertFaultGetData();
      }
    };
    await getActiveDueScheduledReportsApi(callApi, callBack, {});
    setIsLoading(false);
    return result;
  };

  return {
    scheduledReports,
    isLoading,
    getAllScheduledReports,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport,
    toggleScheduledReport,
    runScheduledReport,
    getScheduledReportById,
    getActiveDueScheduledReports,
  };
};

export { useScheduledReports };