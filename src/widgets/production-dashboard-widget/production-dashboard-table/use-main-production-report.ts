import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { systemCurrencyState } from "@/store";
import {
  productionCreationDateState,
  productionDeliveryDateState,
} from "@/store/production-dashboard-dates";
import { useGomakeAxios } from "@/hooks";
import { MainProductionReportResponseDTO } from "./interfaces";

export const useMainProductionReport = () => {
  const { callApi } = useGomakeAxios();
  const { dates: deliveryDates } = useRecoilValue(productionDeliveryDateState);
  const { dates: creationDates } = useRecoilValue(productionCreationDateState);
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

    if (!hasDeliveryDates && !hasCreationDates) {
      setError(
        "Please select at least one date range (Delivery Date or Creation Date)"
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

  // Fetch data when dates change (triggered by search button or initial load)
  useEffect(() => {
    const hasDeliveryDates = deliveryDates.startDate && deliveryDates.endDate;
    const hasCreationDates = creationDates.startDate && creationDates.endDate;

    // Only fetch if at least one date range is set
    if (hasDeliveryDates || hasCreationDates) {
      fetchData();
    }
  }, [
    deliveryDates.startDate,
    deliveryDates.endDate,
    creationDates.startDate,
    creationDates.endDate,
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
  };
};
