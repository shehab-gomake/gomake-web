import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetEnvelopsCategores,
  getAndSetEnvelopseSize,
} from "@/services/hooks";

const useEnvelops = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [envelopsCategores, setEnvelopsCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [envelopsSuppliers, setEnvelopsSuppliers] = useState([]);
  const [envelopsSizes, setEnvelopsSizes] = useState([]);

  useEffect(() => {
    getEnvelopsSizes();
  }, [categoryName, supplierId]);

  useEffect(() => {
    getEnvelopsCategores();
  }, []);

  const getEnvelopsCategores = useCallback(async () => {
    const data = await getAndSetEnvelopsCategores(
      callApi,
      setEnvelopsCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getEnvelopsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetEnvelopseSize(callApi, setEnvelopsSizes, {
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
    envelopsCategores,
    envelopsSizes,
    onChangeCategory,
    onChangeSupplier,
    setEnvelopsSizes,
    getEnvelopsSizes,
  };
};
export { useEnvelops };
