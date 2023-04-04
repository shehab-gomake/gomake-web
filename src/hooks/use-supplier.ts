import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import { getAndSetSuppliers } from "@/services/hooks";

const useSupplier = () => {
  const { callApi } = useGomakeAxios();
  const [suppliers, setSuppliers] = useState([]);

  const getSupplier = useCallback(async () => {
    await getAndSetSuppliers(callApi, setSuppliers);
  }, []);

  useEffect(() => {
    getSupplier();
  }, []);

  return {
    suppliers,
  };
};

export { useSupplier };
