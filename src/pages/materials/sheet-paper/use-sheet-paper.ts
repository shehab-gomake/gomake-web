import { useCallback, useEffect, useState } from "react";
import {
  getAndSetSheetCategory,
  getAndSetSheetWeights,
} from "@/services/hooks";
import { useGomakeAxios, useSupplier } from "@/hooks";

const useSheetPaper = () => {
  const { callApi } = useGomakeAxios();
  // const { suppliers } = useSupplier();
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allWeights, setAllWeights] = useState([]);

  const getSheetWeights = useCallback(async () => {
    await getAndSetSheetWeights(callApi, setAllWeights, {
      categoryName,
      supplierId,
    });
  }, [categoryName, supplierId]);

  const getCategory = useCallback(async () => {
    const data = await getAndSetSheetCategory(callApi, setSheetCategories);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  useEffect(() => {
    getCategory();
    getSheetWeights();
  }, [categoryName, supplierId]);

  return {
    onChangeCategory,
    onChangeSupplier,
    sheetCategories,
    allWeights,
    categoryName,
  };
};

export { useSheetPaper };
