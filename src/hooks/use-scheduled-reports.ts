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
import { useListPagination } from "./use-list-pagination";

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
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDocumentType, setCurrentDocumentType] = useState<number | undefined>(undefined);
  const { pageSize: defaultPageSize, setPageSize, pagesCount, setPagesCount, pageNumber, setPageNumber, initialPageSize } = useListPagination();
  
  // Use page size of 10 for scheduled reports
  const pageSize = 10;

  const getAllScheduledReports = async (page: number = pageNumber, size: number = pageSize, documentType?: number) => {
    setIsLoading(true);
    if (documentType !== undefined) {
      setCurrentDocumentType(documentType);
    }
    const callBack = (res) => {
      if (res.success) {
        const totalCount = res.data?.totalCount || 0;
        const calculatedPagesCount = Math.ceil(totalCount / size);
        const newScheduledReports = res.data?.scheduledReports || [];

        setScheduledReports(newScheduledReports);
        setTotalCount(totalCount);
        setPagesCount(calculatedPagesCount);
        alertSuccessGetData();
      } else {
        alertFaultGetData();
      }
    };
    await getAllScheduledReportsApi(callApi, callBack, { pageNumber: page, pageSize: size, documentType: documentType || currentDocumentType });
    setIsLoading(false);
  };

  const createScheduledReport = async (data: Partial<ScheduledReport>) => {
    setIsLoading(true);
    const callBack = (res) => {
      if (res.success) {
        alertSuccessUpdate();
        getAllScheduledReports(pageNumber, pageSize, data.documentType || currentDocumentType); // Refresh the list with document type
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
        getAllScheduledReports( pageNumber, pageSize); // Refresh the list
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
        getAllScheduledReports( pageNumber, pageSize); // Refresh the list
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
        getAllScheduledReports( pageNumber, pageSize); // Refresh the list
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

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    getAllScheduledReports(page, pageSize, currentDocumentType);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageNumber(1);
    getAllScheduledReports(1, size, currentDocumentType);
  };

  return {
    scheduledReports,
    totalCount,
    pageNumber,
    pageSize,
    pagesCount,
    isLoading,
    getAllScheduledReports,
    createScheduledReport,
    updateScheduledReport,
    deleteScheduledReport,
    toggleScheduledReport,
    runScheduledReport,
    getScheduledReportById,
    getActiveDueScheduledReports,
    handlePageChange,
    handlePageSizeChange,
  };
};

export { useScheduledReports };