import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetPackInUnitsCategory,
  getAndSetPackInUnitsSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const usePackInDrums = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [packInUnitsCategories, setPackInUnitsCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [packInUnitsSizes, setPackInDrumsSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.packinUnits.code"),
      t("materials.packinUnits.material"),
      t("materials.packinUnits.sizeName"),
      t("materials.packinUnits.width"),
      t("materials.packinUnits.weight"),
      t("materials.packinUnits.stock"),
      t("materials.packinUnits.pricePerUnit"),
      t("materials.packinUnits.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetPackInUnitsCategory(
      callApi,
      setPackInUnitsCategories
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getPackInDrumsSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);
  const onClickPackInDrumsSizes = useCallback(async () => {
    const data = await getAndSetPackInUnitsSizes(callApi, setPackInDrumsSizes, {
      categoryName,
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getPackInDrumsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetPackInUnitsSizes(
        callApi,
        setPackInDrumsSizes,
        {
          categoryName,
          supplierId,
        }
      );
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
    const data = await getAndSetPackInUnitsSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setPackInDrumsSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    packInUnitsCategories,
    categoryName,
    packInUnitsSizes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getPackInDrumsSizes,
    onClickPackInDrumsSizes,
    getAllAdditionRefetch,
    setPackInDrumsSizes,
  };
};
export { usePackInDrums };
