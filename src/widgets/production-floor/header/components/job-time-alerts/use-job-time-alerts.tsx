import { useState, useEffect, useCallback } from "react";
import { useGomakeAxios } from "@/hooks";
import {
  addUpdateListApi,
  deleteStepApi,
  updateStepApi,
  getJobTimeAlertStepApi,
} from "@/services/api-service/job-time-alerts/job-time-alerts-endpoints";

export interface IJobTimeAlertStep {
  id?: string;
  timeFromDeliveryTime: number;
  color: string;
}

const useJobTimeAlerts = () => {
  const { callApi } = useGomakeAxios();
  const [steps, setSteps] = useState<IJobTimeAlertStep[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    const callBack = (res: any) => {
      setLoading(false);
      if (res.success) {
        setSteps(res.data || []);
      } else {
        setError("Failed to fetch job time alert steps");
        setSteps([]);
      }
    };
    await getJobTimeAlertStepApi(callApi, callBack);
  }, [callApi]);

  const addOrUpdateSteps = useCallback(
    async (stepsData: IJobTimeAlertStep[]) => {
      setLoading(true);
      setError(null);
      const callBack = async (res: any) => {
        setLoading(false);
        if (res.success) {
          // Fetch fresh data from API to get IDs assigned by backend
          await fetchSteps();
        } else {
          setError("Failed to save job time alert steps");
        }
      };
      await addUpdateListApi(callApi, callBack, stepsData);
    },
    [callApi, fetchSteps]
  );

  const deleteStep = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      const callBack = async (res: any) => {
        setLoading(false);
        if (res.success) {
          // Fetch fresh data from API to ensure consistency
          await fetchSteps();
        } else {
          setError("Failed to delete job time alert step");
        }
      };
      await deleteStepApi(callApi, callBack, id);
    },
    [callApi, fetchSteps]
  );

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  return {
    steps,
    loading,
    error,
    fetchSteps,
    addOrUpdateSteps,
    deleteStep,
    setSteps,
  };
};

export { useJobTimeAlerts };
