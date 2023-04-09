import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAndSetLaminationCategores,
  getAndSetLaminationSize,
  getAndSetLaminatioThicknes,
} from "@/services/hooks";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";

const useLamination = () => {
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState(undefined);
  const { callApi } = useGomakeAxios();
  const [laminationSizes, setLaminatioSizes] = useState([]);
  const [laminationCategores, setLaminatioCategores] = useState([]);
  const [laminationThicknes, setLaminatioThicknes] = useState([]);

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
    });
  }, [categoryName]);
  const getLaminationCategores = useCallback(async () => {
    const data = await getAndSetLaminationCategores(
      callApi,
      setLaminatioCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getLaminationThicknes = useCallback(async () => {
    const data = await getAndSetLaminatioThicknes(
      callApi,
      setLaminatioThicknes
    );
  }, [categoryName]);

  useEffect(() => {
    getLaminationCategores();
    getLaminationSizes();
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  return {
    getLaminationThicknes,
    onChangeCategory,
    laminationCategores,
    laminationThicknes,
    laminationSizes,
    categoryName,
    headerTable,
  };
};
export { useLamination };
