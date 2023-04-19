import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetTubessCategores,
  getAndSetTubessSize,
} from "@/services/hooks";

const useTubess = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [tubesCategores, setTubessCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [tubesSizes, setTubesssSizes] = useState([]);

  useEffect(() => {
    getTubessSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getTubessCategores();
  }, []);

  const getTubessCategores = useCallback(async () => {
    const data = await getAndSetTubessCategores(callApi, setTubessCategores);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getTubessSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetTubessSize(callApi, setTubesssSizes, {
        categoryName,
        supplierId: supplierId || "",
      });
      return data;
    }
    return null;
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    supplierId,
    categoryName,
    tubesCategores,
    tubesSizes,
    getTubessSizes,
    setTubesssSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useTubess };
