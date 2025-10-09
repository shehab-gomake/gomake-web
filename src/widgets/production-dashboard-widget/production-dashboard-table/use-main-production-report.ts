import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { dashboardDateState } from "@/store";
import { useGomakeAxios } from "@/hooks";
import { format } from "date-fns";
import {
  MainProductionReportResponseDTO,
  DepartmentPerformanceDTO,
} from "./interfaces";
import { mockProductionReportData } from "./mock-data";

export const useMainProductionReport = () => {
  const { callApi } = useGomakeAxios();
  const { dates } = useRecoilValue(dashboardDateState);

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
    if (!dates.startDate || !dates.endDate) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data for testing
      setData(mockProductionReportData);

      // Uncomment below to use real API when ready
      /*
      const response = await callApi(
        "GET",
        "/v1/jobs-service/get-main-production-report",
        {
          startDate: format(dates.startDate, "yyyy-MM-dd"),
          endDate: format(dates.endDate, "yyyy-MM-dd"),
        },
        false
      );

      if (response?.success) {
        setData(response.data);
      } else {
        setError(response?.message || "Failed to fetch data");
      }
      */
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

  // Formatting functions
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Effect to fetch data when dates change
  useEffect(() => {
    fetchData();
  }, [dates.startDate, dates.endDate]);

  return {
    // State
    loading,
    data,
    error,
    expandedDepartments,

    // Functions
    toggleDepartment,
    toggleAllDepartments,
    formatTime,
    formatPercentage,
    formatCurrency,
  };
};
