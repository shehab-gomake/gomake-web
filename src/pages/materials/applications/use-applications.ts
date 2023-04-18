import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetApplicationsCategory,
  getAndSetApplicationSizes,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useApplications = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [applicationCategories, setApplicationCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allSizes, setAllSizes] = useState([]);
  const headerTable = useMemo(
    () => [
      t("materials.applications.categoryName"),
      t("materials.applications.thickness"),
      t("materials.applications.weightPerSquareMeter"),
      t("materials.applications.settings"),
    ],
    []
  );

  const getApplicationSizes = useCallback(async () => {
    await getAndSetApplicationSizes(callApi, setAllSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId]);

  const getCategory = useCallback(async () => {
    const data = await getAndSetApplicationsCategory(
      callApi,
      setApplicationCategories
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
    getApplicationSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);

  return {
    onChangeCategory,
    onChangeSupplier,
    setAllSizes,
    applicationCategories,
    allSizes,
    categoryName,
    headerTable,
  };
};

export { useApplications };
