import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetTubessCategores,
  getAndSetTubessSuppliers,
  getAndSetTubessSize,
} from "@/services/hooks";

const useTubess = () => {
  const { callApi } = useGomakeAxios();
  const [categoryName, setCategoryName] = useState("");
  const [tubesCategores, setTubessCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [tubesSuppliers, setTubesssSuppliers] = useState([]);
  const [tubesSizes, setTubesssSizes] = useState([]);

  useEffect(() => {
    getTubessCategores();
    getTubessSuppliers();
    getTubessSizes();
  }, [categoryName, supplierId]);

  const getTubessCategores = useCallback(async () => {
    const data = await getAndSetTubessCategores(callApi, setTubessCategores);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getTubessSuppliers = useCallback(async () => {
    const data = await getAndSetTubessSuppliers(callApi, setTubesssSuppliers);
  }, [supplierId]);

  const getTubessSizes = useCallback(async () => {
    await getAndSetTubessSize(callApi, setTubesssSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId, setTubesssSizes]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  return {
    categoryName,
    tubesCategores,
    tubesSuppliers,
    tubesSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useTubess };
