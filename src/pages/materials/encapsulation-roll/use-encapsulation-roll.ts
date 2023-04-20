import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetEncapsulationRollsCategory,
  getAndSetEncapsulationRollsThickness,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useEncapsulationRoll = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [encapsulationRollCategories, setEncapsulationRollCategories] =
    useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allThickness, setAllThickness] = useState([]);
  const headerTable = useMemo(
    () => [
      t("materials.encapsulationRoll.categoryName"),
      t("materials.encapsulationRoll.thickness"),
      t("materials.encapsulationRoll.weightPerSquareMeter"),
      t("materials.encapsulationRoll.settings"),
    ],
    []
  );

  const EncapsulationRollsThickness = useCallback(async () => {
    await getAndSetEncapsulationRollsThickness(callApi, setAllThickness, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId]);

  const getCategory = useCallback(async () => {
    const data = await getAndSetEncapsulationRollsCategory(
      callApi,
      setEncapsulationRollCategories
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  useEffect(() => {
    EncapsulationRollsThickness();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);

  return {
    onChangeCategory,
    onChangeSupplier,
    setAllThickness,
    encapsulationRollCategories,
    allThickness,
    categoryName,
    headerTable,
  };
};

export { useEncapsulationRoll };
