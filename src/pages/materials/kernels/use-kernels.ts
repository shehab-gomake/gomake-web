import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetKernelsCategores,
  getAndSetKernelsSuppliers,
} from "@/services/hooks";

const useKernels = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [kernelsCategores, setKernelsCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [kernelsSuppliers, setKernelssSuppliers] = useState([]);

  useEffect(() => {
    getKernelsCategores();
    getKernelsSuppliers();
  }, [categoryName]);

  const getKernelsCategores = useCallback(async () => {
    const data = await getAndSetKernelsCategores(callApi, setKernelsCategores);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getKernelsSuppliers = useCallback(async () => {
    const data = await getAndSetKernelsSuppliers(callApi, setKernelssSuppliers);
  }, [supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    categoryName,
    kernelsCategores,
    kernelsSuppliers,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useKernels };
