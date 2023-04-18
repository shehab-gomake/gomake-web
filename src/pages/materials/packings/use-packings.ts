import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetPackingsCategory,
  getAndSetPackingsVolumes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const usePackings = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [packingsCategories, setPackingsCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [packingsVolumes, setPackingsVolumes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tabelHeaders = useMemo(
    () => [
      t("materials.packings.code"),
      t("materials.packings.height"),
      t("materials.packings.width"),
      t("materials.packings.stock"),
      t("materials.packings.pricePerUnit"),
      t("materials.packings.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetPackingsCategory(
      callApi,
      setPackingsCategories
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getPackingsVolumes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);

  const getPackingsVolumes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetPackingsVolumes(callApi, setPackingsVolumes, {
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
  return {
    tabelHeaders,
    supplierId,
    openModal,
    packingsCategories,
    categoryName,
    packingsVolumes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getPackingsVolumes,
    setPackingsVolumes,
  };
};
export { usePackings };
