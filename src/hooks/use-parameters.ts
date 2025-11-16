import { parametersState } from "@/store";
import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useGomakeAxios } from "./use-gomake-axios";
import { getAndSetAllParameters } from "@/services/hooks/admin-side/products/get-set-all-parameters";

const useParameters = () => {
  const { callApi } = useGomakeAxios();
  const [parametersStateValue, setParametersState] = useRecoilState<any>(parametersState);

  const getParameters = useCallback(async () => {
    return await getAndSetAllParameters(callApi, setParametersState);
  }, []);

  useEffect(() => {
    getParameters();
  }, []);
  return {
    parametersStateValue
  };
};

export { useParameters };
