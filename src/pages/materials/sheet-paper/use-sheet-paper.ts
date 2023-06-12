import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetAllSheetWeights,
  getAndSetSheetCategory,
  getAndSetSheetWeights,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheetPaper = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allWeights, setAllWeights] = useState([]);
  const [allWeightsGrouped, setAllWeightsGrouped] = useState([]);
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.weight"),
      t("materials.sheetPaper.thickness"),
      t("materials.sheetPaper.pricePerTon"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );

  const getSheetWeights = useCallback(async () => {
    await getAndSetSheetWeights(callApi, setAllWeights, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId]);

  const getSheetAllWeights = useCallback(async () => {
    await getAndSetAllSheetWeights(callApi, setAllWeightsGrouped, {
      categoryName,
      supplierId: supplierId || "",
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
    getSheetWeights();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);

  return {
    onChangeCategory,
    onChangeSupplier,
    setAllWeights,
    sheetCategories,
    categoryName,
    allWeights,
    headerTable,
    allWeightsGrouped,
  };
};

export { useSheetPaper };
