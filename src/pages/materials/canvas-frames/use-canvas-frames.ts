import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndCanvasFramesCategory,
  getAndSetCanvasFramesSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useCanvasFrames = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [canvasFramesCategories, setCanvasFramesCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [canvasFramesSizes, setCanvasFramesSizes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tabelHeaders = useMemo(
    () => [
      t("materials.canvasFrames.code"),
      t("materials.canvasFrames.width"),
      t("materials.canvasFrames.height"),
      t("materials.canvasFrames.stock"),
      t("materials.canvasFrames.price"),
      t("materials.canvasFrames.settings"),
    ],
    []
  );
  const getCategory = useCallback(async () => {
    const data = await getAndCanvasFramesCategory(
      callApi,
      setCanvasFramesCategories
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getCanvasFrameSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getCategory();
  }, []);
  const OnClickCanvasFrameSizes = useCallback(async () => {
    const data = await getAndSetCanvasFramesSizes(
      callApi,
      setCanvasFramesSizes,
      {
        categoryName,
        supplierId,
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [categoryName, supplierId]);
  const getCanvasFrameSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetCanvasFramesSizes(
        callApi,
        setCanvasFramesSizes,
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
    const data = await getAndSetCanvasFramesSizes(callApi, undefined, {
      categoryName,
      supplierId,
    });
    return data;
  }, [supplierId, setCanvasFramesSizes]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    canvasFramesCategories,
    categoryName,
    canvasFramesSizes,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getCanvasFrameSizes,
    OnClickCanvasFrameSizes,
    getAllAdditionRefetch,
    setCanvasFramesSizes,
  };
};
export { useCanvasFrames };
