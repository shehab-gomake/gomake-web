import { useGomakeAxios } from "@/hooks";
import { useEffect, useState } from "react";

const useParameters = () => {
  const [parameters, setParameters] = useState([]);
  const { callApi } = useGomakeAxios();

  useEffect(() => {
    getParameters().then((res) => {
      setParameters(res?.data?.data?.data);
    });
  }, []);
  const getParameters = async () => {
    return await callApi(
      "GET",
      "/v1/printhouse-config/parameters/get-all-parameters"
    );
  };

  return {
    getParameters,
    parameters,
  };
};

export { useParameters };
