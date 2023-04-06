import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetBraceCategores,
  getAndSetBraceSuppliers,
  getAndSetBraceSize,
} from "@/services/hooks";

const useBrace = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [braceCategores, setBraceCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [braceSuppliers, setBraceSuppliers] = useState([]);
  const [braceSizes, setBraceSizes] = useState([]);

  useEffect(() => {
    getBraceCategores();
    getBraceSuppliers();
    getBraceSizes();
  }, [categoryName, supplierId]);

  const getBraceCategores = useCallback(async () => {
    const data = await getAndSetBraceCategores(callApi, setBraceCategores);

    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getBraceSuppliers = useCallback(async () => {
    const data = await getAndSetBraceSuppliers(callApi, setBraceSuppliers);
  }, [supplierId]);

  const getBraceSizes = useCallback(async () => {
    await getAndSetBraceSize(callApi, setBraceSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId, setBraceSizes]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  return {
    braceCategores,
    categoryName,
    braceSuppliers,
    supplierId,
    braceSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useBrace };
