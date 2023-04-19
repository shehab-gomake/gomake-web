import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetFoilsCategory, getAndSetFoilsSizes } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useFoils = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [foilsCategories, setFoilsCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [foilsSizes, setFoilsSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.foils.code"),
      t("materials.foils.height"),
      t("materials.foils.width"),
      t("materials.foils.stock"),
      t("materials.foils.pricePerRoll"),
      t("materials.foils.weightPerSquareMeter"),
      t("materials.foils.pricePerSquareMeter"),
      t("materials.foils.thickness"),
      t("materials.foils.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetFoilsCategory(callApi, setFoilsCategories);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getFoilsSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);
  const OnClickFoilSizes = useCallback(async () => {
    const data = await getAndSetFoilsSizes(callApi, setFoilsSizes, {
      categoryName,
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getFoilsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetFoilsSizes(callApi, setFoilsSizes, {
        categoryName,
        supplierId,
      });
      return data;
    }
    return null;
  }, [supplierId, categoryName]);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const getAllAdditionRefetch = useCallback(async () => {
    const data = await getAndSetFoilsSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setFoilsSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    foilsCategories,
    categoryName,
    foilsSizes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getFoilsSizes,
    OnClickFoilSizes,
    getAllAdditionRefetch,
    setFoilsSizes,
  };
};
export { useFoils };
