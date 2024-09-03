import { useGomakeAxios } from "@/hooks";
import { useEffect, useState } from "react";

interface UseOutputsProps {
  shouldRenderOutputsOnMount?: boolean;
}

const useOutputs = ({ shouldRenderOutputsOnMount = true }: UseOutputsProps = {}) => {
  const [Outputs, setOutputs] = useState([]);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    if (shouldRenderOutputsOnMount) {
      getOutputs().then((res) => {
        setOutputs(res?.data?.data?.data);
      });
    }
  }, [shouldRenderOutputsOnMount]);
  
  const getOutputs = async () => {
    return await callApi("GET", "/v1/printhouse-config/Output/get-all-Outputs");
  };

  return {
    getOutputs,
    Outputs,
  };
};

export { useOutputs };
