import { useGomakeAxios } from "@/hooks";
import { useEffect, useState, useCallback } from "react";

interface UseOutputsProps {
  shouldRenderOutputsOnMount?: boolean;
}

const useOutputs = ({ shouldRenderOutputsOnMount = true }: UseOutputsProps = {}) => {
  const [Outputs, setOutputs] = useState([]);
  const { callApi } = useGomakeAxios();
  
  const getOutputs = useCallback(async () => {
    const res = await callApi("GET", "/v1/printhouse-config/Output/get-all-Outputs");
    // Update state when getOutputs is called
    if (res?.data?.data?.data) {
      setOutputs(res.data.data.data);
    }
    return res;
  }, [callApi]);

  useEffect(() => {
    if (shouldRenderOutputsOnMount) {
      getOutputs();
    }
  }, [shouldRenderOutputsOnMount, getOutputs]);

  return {
    getOutputs,
    Outputs,
  };
};

export { useOutputs };
