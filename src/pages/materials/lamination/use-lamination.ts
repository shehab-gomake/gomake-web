import { useCallback, useEffect, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetLaminationCategores,
  getAndSetLaminationSize,
} from "@/services/hooks";

const useLamination = () => {
  const [categoryName, setCategoryName] = useState(undefined);
  const { callApi } = useGomakeAxios();
  const [laminationSizes, setLaminatioSizes] = useState([]);
  const [laminationCategores, setLaminatioCategores] = useState([]);
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
  useEffect(() => {
    getLaminationCategores();
    getLaminationSizes();
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);
  return {
    onChangeCategory,
    laminationCategores,
    laminationSizes,
    categoryName,
  };
};
export { useLamination };
