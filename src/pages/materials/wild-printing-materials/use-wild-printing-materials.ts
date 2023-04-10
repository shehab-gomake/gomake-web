import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetSheetWeights,
  getAndSetWildPrintingMaterialCategory,
  getAndSetWildPrintingMaterialTypes,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useWildPrintingMaterials = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [WildPrintingMaterialCategories, setWildPrintingMaterialCategories] =
    useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allTypes, setAllTypes] = useState([]);
  const headerTable = useMemo(
    () => [
      t("materials.wildPrintingMaterials.thickness"),
      t("materials.wildPrintingMaterials.weightPerMeterSquare"),
      t("materials.wildPrintingMaterials.hardness"),
      t("materials.wildPrintingMaterials.settings"),
    ],
    []
  );

  const getWildPrintingMaterialTypes = useCallback(async () => {
    await getAndSetWildPrintingMaterialTypes(callApi, setAllTypes, {
      categoryName,
      supplierId,
    });
  }, [categoryName, supplierId]);

  const getCategory = useCallback(async () => {
    const data = await getAndSetWildPrintingMaterialCategory(
      callApi,
      setWildPrintingMaterialCategories
    );
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
    getWildPrintingMaterialTypes();
  }, [categoryName, supplierId]);

  return {
    onChangeCategory,
    onChangeSupplier,
    WildPrintingMaterialCategories,
    allTypes,
    categoryName,
    headerTable,
  };
};

export { useWildPrintingMaterials };
