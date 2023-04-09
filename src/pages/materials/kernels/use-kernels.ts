import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetKernelsCategores,
  getAndSetKernelsSuppliers,
  getAndSetKernelsSize,
} from "@/services/hooks";

const useKernels = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [kernelsCategores, setKernelsCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [kernelsSuppliers, setKernelssSuppliers] = useState([]);
  const [kernelsSizes, setKernelssSizes] = useState([]);

  useEffect(() => {
    getKernelsCategores();
    getKernelsSuppliers();
    getKernelsSizes();
  }, [categoryName, supplierId]);

  const getKernelsCategores = useCallback(async () => {
    const data = await getAndSetKernelsCategores(callApi, setKernelsCategores);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getKernelsSuppliers = useCallback(async () => {
    const data = await getAndSetKernelsSuppliers(callApi, setKernelssSuppliers);
  }, [supplierId]);

  const getKernelsSizes = useCallback(async () => {
    await getAndSetKernelsSize(callApi, setKernelssSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId, setKernelssSizes]);

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
    kernelsSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useKernels };
