import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";
import {
  productionCreationDateState,
  productionDeliveryDateState,
  productionActivityDateState,
  productionStatusesState,
  productionStatusesInitializedState,
} from "@/store/production-dashboard-dates";
import { useGomakeAxios } from "@/hooks";
import { MainProductionReportResponseDTO } from "./interfaces";

export const useMainProductionReport = () => {
  const { callApi } = useGomakeAxios();
  const { dates: deliveryDates } = useRecoilValue(productionDeliveryDateState);
  const { dates: creationDates } = useRecoilValue(productionCreationDateState);
  const { dates: activityDates } = useRecoilValue(productionActivityDateState);
  const statuses = useRecoilValue(productionStatusesState);
  const statusesInitialized = useRecoilValue(
    productionStatusesInitializedState
  );
  const systemCurrency = useRecoilValue(systemCurrencyState);

  // State management
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MainProductionReportResponseDTO | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(
    new Set()
  );

  // API call function
  const fetchData = async () => {
    // Require at least one date range to be filled
    const hasDeliveryDates = deliveryDates.startDate && deliveryDates.endDate;
    const hasCreationDates = creationDates.startDate && creationDates.endDate;
    const hasActivityDates = activityDates.startDate && activityDates.endDate;

    if (!hasDeliveryDates && !hasCreationDates && !hasActivityDates) {
      setError(
        "Please select at least one date range (Delivery Date, Creation Date, or Activity Date)"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await callApi(
        "POST",
        "/v1/job-service/production-dashboard/get-main-production-report",
        {
          fromDeliveryDate: deliveryDates.startDate
            ? deliveryDates.startDate.toISOString()
            : undefined,
          toDeliveryDate: deliveryDates.endDate
            ? deliveryDates.endDate.toISOString()
            : undefined,
          fromCreationDate: creationDates.startDate
            ? creationDates.startDate.toISOString()
            : undefined,
          toCreationDate: creationDates.endDate
            ? creationDates.endDate.toISOString()
            : undefined,
          fromInDate: activityDates.startDate
            ? activityDates.startDate.toISOString()
            : undefined,
          toInDate: activityDates.endDate
            ? activityDates.endDate.toISOString()
            : undefined,
          statuses:
            statuses && statuses.length > 0
              ? statuses.filter((statusId) => statusId !== "done")
              : undefined,
        },
        false
      );

      if (response?.success) {
        setData(response.data.data.data);
      } else {
        setError(response?.message || "Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
      console.error("Error fetching production report:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle department expansion
  const toggleDepartment = (departmentId: string) => {
    setExpandedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  // Toggle all departments
  const toggleAllDepartments = () => {
    if (!data?.departments) return;

    if (expandedDepartments.size === data.departments.length) {
      // Collapse all
      setExpandedDepartments(new Set());
    } else {
      // Expand all
      setExpandedDepartments(
        new Set(data.departments.map((dept) => dept.departmentId))
      );
    }
  };

  // Helper function to safely parse numbers
  const safeNumber = (value: any): number | null => {
    if (value == null) return null;
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (!isFinite(num) || isNaN(num)) return null;
    return num;
  };

  // Formatting functions
  const formatTime = (time: number) => {
    const safeTime = safeNumber(time);
    if (safeTime == null) return "0h 0m";

    const hours = Math.floor(safeTime);
    const minutes = Math.round((safeTime - hours) * 60);

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const formatPercentage = (value: number) => {
    const safeValue = safeNumber(value);
    if (safeValue == null) return "N/A";
    return `${safeValue.toFixed(2)}%`;
  };

  const formatNumber = (value: number) => {
    const safeValue = safeNumber(value);
    if (safeValue == null) return "N/A";
    return safeValue.toFixed(2);
  };

  const formatCurrency = (value: number) => {
    const safeValue = safeNumber(value);
    if (safeValue == null) return "N/A";

    const currency = systemCurrency || "USD";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(safeValue);
  };

  // Download Excel function
  const downloadExcel = async () => {
    // Require at least one date range to be filled
    const hasDeliveryDates = deliveryDates.startDate && deliveryDates.endDate;
    const hasCreationDates = creationDates.startDate && creationDates.endDate;
    const hasActivityDates = activityDates.startDate && activityDates.endDate;

    if (!hasDeliveryDates && !hasCreationDates && !hasActivityDates) {
      setError(
        "Please select at least one date range (Delivery Date, Creation Date, or Activity Date)"
      );
      return;
    }

    try {
      const response = await callApi(
        "POST",
        "/v1/job-service/production-dashboard/download-production-dashboard-report",
        {
          fromDeliveryDate: deliveryDates.startDate
            ? deliveryDates.startDate.toISOString()
            : undefined,
          toDeliveryDate: deliveryDates.endDate
            ? deliveryDates.endDate.toISOString()
            : undefined,
          fromCreationDate: creationDates.startDate
            ? creationDates.startDate.toISOString()
            : undefined,
          toCreationDate: creationDates.endDate
            ? creationDates.endDate.toISOString()
            : undefined,
          fromInDate: activityDates.startDate
            ? activityDates.startDate.toISOString()
            : undefined,
          toInDate: activityDates.endDate
            ? activityDates.endDate.toISOString()
            : undefined,
          statuses:
            statuses && statuses.length > 0
              ? statuses.filter((statusId) => statusId !== "done")
              : undefined,
        },
        true, // lock screen
        null, // abort controller
        "blob" // responseType for file download
      );

      // For blob responses, response.data is the blob itself
      if (response?.success && response.data) {
        // response.data is already a Blob when responseType is "blob"
        const blob =
          response.data instanceof Blob
            ? response.data
            : new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename with current date
        const date = new Date();
        const formattedDate = date
          .toISOString()
          .split("T")[0]
          .replace(/-/g, "-");
        const formattedTime = date
          .toTimeString()
          .split(" ")[0]
          .replace(/:/g, "-");
        link.download = `Production_Report_${formattedDate}_${formattedTime}.xlsx`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        setError("Failed to download report");
      }
    } catch (err) {
      setError("An error occurred while downloading the report");
      console.error("Error downloading production report:", err);
    }
  };

  // Fetch data when dates or statuses change (triggered by search button or initial load)
  // Only call API after statuses have been initialized (loaded from board-missions/statuses/get-all)
  useEffect(() => {
    const hasDeliveryDates = deliveryDates.startDate && deliveryDates.endDate;
    const hasCreationDates = creationDates.startDate && creationDates.endDate;
    const hasActivityDates = activityDates.startDate && activityDates.endDate;

    // Only fetch if:
    // 1. At least one date range is set
    // 2. Statuses have been initialized (loaded from API)
    if (
      (hasDeliveryDates || hasCreationDates || hasActivityDates) &&
      statusesInitialized
    ) {
      fetchData();
    }
  }, [
    deliveryDates.startDate,
    deliveryDates.endDate,
    creationDates.startDate,
    creationDates.endDate,
    activityDates.startDate,
    activityDates.endDate,
    statuses,
    statusesInitialized,
  ]);

  return {
    // State
    loading,
    data,
    error,
    expandedDepartments,

    // Functions
    fetchData,
    toggleDepartment,
    toggleAllDepartments,
    formatTime,
    formatPercentage,
    formatNumber,
    formatCurrency,
    downloadExcel,
  };
};
