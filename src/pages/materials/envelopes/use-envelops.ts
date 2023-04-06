import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetEnvelopsCategores,
  getAndSetEnvelopsSuppliers,
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
    getEnvelopsCategores();
    getEnvelopsSuppliers();
    getBraceSizes();
  }, [categoryName, supplierId]);

  const getEnvelopsCategores = useCallback(async () => {
    const data = await getAndSetEnvelopsCategores(
      callApi,
      setEnvelopsCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getEnvelopsSuppliers = useCallback(async () => {
    const data = await getAndSetEnvelopsSuppliers(
      callApi,
      setEnvelopsSuppliers
    );
  }, [supplierId]);

  const getBraceSizes = useCallback(async () => {
    await getAndSetEnvelopseSize(callApi, setEnvelopsSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId, setEnvelopsSizes]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    categoryName,
    envelopsCategores,
    envelopsSuppliers,
    envelopsSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useEnvelops };
