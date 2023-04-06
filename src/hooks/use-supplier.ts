import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "./use-gomake-axios";
import {
  getAndSetSuppliers,
  getAndSetSuppliersCurrencies,
} from "@/services/hooks";

const useSupplier = () => {
  const { callApi } = useGomakeAxios();
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersCurrencies, setSuppliersCurrencies] = useState([]);

  const getSupplier = useCallback(async () => {
    await getAndSetSuppliers(callApi, setSuppliers);
  }, []);

  const getSupplierCurrencies = useCallback(async () => {
    await getAndSetSuppliersCurrencies(callApi, setSuppliersCurrencies);
  }, []);

  return {
    getSupplier,
    getSupplierCurrencies,
    suppliers,
    suppliersCurrencies,
  };
};

export { useSupplier };
