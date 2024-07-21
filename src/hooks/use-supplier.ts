import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

import {
  getAndSetAllCustomers,
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


  const [supplierList, setSupplierList] = useState([]);
  const getAllSupplierList = useCallback(async (SearchTerm?) => {
    await getAndSetAllCustomers(callApi, setSupplierList, {
      ClientType: "S",
      searchTerm: SearchTerm,
      onlyCreateOrderClients: true,
    });
  }, []);


  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      getAllSupplierList(e.target.value);
    } else {
      getAllSupplierList();
    }
  };
  
  const renderSuppliersOptions = () => {
    return supplierList.map((supplier) => ({ value: supplier.id, label: supplier.name }));
  };


  return {
    getSupplier,
    getSupplierCurrencies,
    suppliers,
    suppliersCurrencies,
    getAllSupplierList,
    checkWhatRenderArray,
    renderSuppliersOptions
  };
};

export { useSupplier };
