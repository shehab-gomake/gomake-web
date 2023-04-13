import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetFramesCategory,
  getAndSetFramesSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useCanvasFrames = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [framesCategories, setFramesCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [framesSizes, setFramesSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tabelHeaders = useMemo(
    () => [
      t("materials.frames.code"),
      t("materials.frames.categoryName"),
      t("materials.frames.width"),
      t("materials.frames.height"),
      t("materials.frames.weight"),
      t("materials.frames.color"),
      t("materials.frames.thickness"),
      t("materials.frames.stock"),
      t("materials.frames.price"),
      t("materials.frames.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetFramesCategory(callApi, setFramesCategories);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getFramesSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);
  const OnClickFrameSizes = useCallback(async () => {
    const data = await getAndSetFramesSizes(callApi, setFramesSizes, {
      categoryName,
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getFramesSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetFramesSizes(callApi, setFramesSizes, {
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
    const data = await getAndSetFramesSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setFramesSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    framesCategories,
    categoryName,
    framesSizes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getFramesSizes,
    OnClickFrameSizes,
    getAllAdditionRefetch,
    setFramesSizes,
  };
};
export { useCanvasFrames };
