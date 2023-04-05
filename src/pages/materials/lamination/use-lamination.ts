import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetLaminationCategores,
  getAndSetLaminationSize,
  getAndSetLaminatioThicknes,
} from "@/services/hooks";

const useLamination = () => {
  const [categoryName, setCategoryName] = useState(undefined);
  const { callApi } = useGomakeAxios();
  const [laminationSizes, setLaminatioSizes] = useState([]);
  const [laminationCategores, setLaminatioCategores] = useState([]);
  const [laminationThicknes, setLaminatioThicknes] = useState([]);

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
  };
};
export { useLamination };
