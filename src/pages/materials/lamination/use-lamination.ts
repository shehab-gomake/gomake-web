import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAndSetLaminationCategores,
  getAndSetLaminationSize,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";

const useLamination = () => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(undefined);
  const { callApi } = useGomakeAxios();
  const [laminationSizes, setLaminatioSizes] = useState([]);
  const [laminationCategores, setLaminatioCategores] = useState([]);
  const [supplierId, setSupplierId] = useState(undefined);
  const headerTable = useMemo(
    () => [
      t("materials.lamination.category"),
      t("materials.lamination.height"),
      t("materials.lamination.width"),
      t("materials.lamination.settings"),
    ],
    []
  );
  const getLaminationSizes = useCallback(async () => {
    await getAndSetLaminationSize(callApi, setLaminatioSizes, {
      categoryName,
      supplierId: supplierId || "",
    });
  }, [categoryName, supplierId]);
  const getLaminationCategores = useCallback(async () => {
    const data = await getAndSetLaminationCategores(
      callApi,
      setLaminatioCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  useEffect(() => {
    getLaminationSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getLaminationCategores();
  }, []);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  return {
    onChangeCategory,
    onChangeSupplier,
    setLaminatioSizes,
    laminationCategores,
    laminationSizes,
    categoryName,
    headerTable,
  };
};
export { useLamination };
