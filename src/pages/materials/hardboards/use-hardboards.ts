import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetHardboardsCategory,
  getAndSetHardboardSizes,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheetPaper = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");
  const [hardboardsCategores, setHardboardsCategores] = useState([]);
  const [supplierId, setSupplierId] = useState(undefined);
  const [hardboardsSizes, setHardboardSizes] = useState([]);
  const tabelHeaders = useMemo(
    () => [
      t("materials.hardboards.category"),
      t("materials.hardboards.height"),
      t("materials.hardboards.width"),
      t("materials.hardboards.hardness"),
      t("materials.hardboards.settings"),
    ],
    []
  );

  const getCategory = useCallback(async () => {
    const data = await getAndSetHardboardsCategory(
      callApi,
      setHardboardsCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getHardboardsSizes = useCallback(async () => {
    await getAndSetHardboardSizes(callApi, setHardboardSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);

  useEffect(() => {
    getCategory();
    getHardboardsSizes();
  }, [categoryName, supplierId]);

  return {
    categoryName,
    hardboardsCategores,
    hardboardsSizes,
    tabelHeaders,
    onChangeCategory,
    onChangeSupplier,
  };
};

export { useSheetPaper };
