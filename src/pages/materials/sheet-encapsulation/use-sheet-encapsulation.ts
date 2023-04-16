import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetSheetEncapsulationCategory,
  getAndSetSheetEncapsulationSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useSheetEncapsulation = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [sheetEncapsulationCategories, setSheetEncapsulationCategories] =
    useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [sheetEncapsulationSizes, setSheetEncapsulationSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tabelHeaders = useMemo(
    () => [
      t("materials.sheetEncapsulation.code"),
      t("materials.sheetEncapsulation.width"),
      t("materials.sheetEncapsulation.height"),
      t("materials.sheetEncapsulation.weight"),
      t("materials.sheetEncapsulation.thickness"),
      t("materials.sheetEncapsulation.quantityInPackage"),
      t("materials.sheetEncapsulation.stock"),
      t("materials.sheetEncapsulation.pricePerUnit"),
      t("materials.sheetEncapsulation.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetSheetEncapsulationCategory(
      callApi,
      setSheetEncapsulationCategories
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
    const data = await getAndSetSheetEncapsulationSizes(
      callApi,
      setSheetEncapsulationSizes,
      {
        categoryName,
        supplierId,
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getPackInDrumsSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetSheetEncapsulationSizes(
        callApi,
        setSheetEncapsulationSizes,
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
    const data = await getAndSetSheetEncapsulationSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setSheetEncapsulationSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    sheetEncapsulationCategories,
    categoryName,
    sheetEncapsulationSizes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getPackInDrumsSizes,
    onClickPackInDrumsSizes,
    getAllAdditionRefetch,
    setSheetEncapsulationSizes,
  };
};
export { useSheetEncapsulation };
