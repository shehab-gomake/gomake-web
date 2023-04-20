import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetPackInDrumsCategory,
  getAndSetPackInDrumsSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const usePackInDrums = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [packInDrumsCategories, setPackInDrumsCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [packInDrumsSizes, setPackInDrumsSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.packinDrums.code"),
      t("materials.packinDrums.material"),
      t("materials.packinDrums.sizeName"),
      t("materials.packinDrums.stock"),
      t("materials.packinDrums.drumRingNumber"),
      t("materials.packinDrums.weight"),
      t("materials.packinDrums.pricePerDrum"),
      t("materials.packinDrums.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetPackInDrumsCategory(
      callApi,
      setPackInDrumsCategories
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
    const data = await getAndSetPackInDrumsSizes(callApi, setPackInDrumsSizes, {
      categoryName,
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getPackInDrumsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetPackInDrumsSizes(
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
    const data = await getAndSetPackInDrumsSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setPackInDrumsSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    packInDrumsCategories,
    categoryName,
    packInDrumsSizes,
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
