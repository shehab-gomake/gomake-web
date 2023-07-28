import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetPlatsCategores, getAndSetBraceSize } from "@/services/hooks";

const usePlats = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [platsCategores, setPlatsCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [platsSizes, setPlatsSizes] = useState([]);

  useEffect(() => {
    getPlatsSizes();
  }, [categoryName, supplierId]);

  useEffect(() => {
    getBraceCategores();
  }, []);

  const getBraceCategores = useCallback(async () => {
    const data = await getAndSetPlatsCategores(callApi, setPlatsCategores);

    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getPlatsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetBraceSize(callApi, setPlatsSizes, {
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
    platsCategores,
    categoryName,
    platsSizes,
    setPlatsSizes,
    getPlatsSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { usePlats };
