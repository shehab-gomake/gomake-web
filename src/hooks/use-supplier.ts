import { useCallback } from "react";
import { useRecoilState } from "recoil";

import {
  getAndSetSheetSuppliers,
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

  const getSupplier = useCallback(
    async (forceFetch = false) => {
      if (suppliers?.length === 0 || forceFetch) {
        const _data = await getAndSetSuppliers(callApi, setSuppliers);
        setSuppliers(
          _data.map((item) => ({ value: item.id, label: item.name }))
        );
      }
    },
    [suppliers]
  );

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
