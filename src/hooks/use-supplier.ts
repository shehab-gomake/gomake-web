import { useCallback } from "react";
import { useRecoilState } from "recoil";

import {
  getAndSetSuppliers,
  getAndSetSuppliersCurrencies,
} from "@/services/hooks";
import { supplierCurrencies, supplierLists } from "@/store";

import { useGomakeAxios } from "./use-gomake-axios";

const useSupplier = () => {
  const { callApi } = useGomakeAxios();
  const [suppliers, setSuppliers] = useRecoilState(supplierLists);
  const [suppliersCurrencies, setSuppliersCurrencies] =
    useRecoilState(supplierCurrencies);

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
