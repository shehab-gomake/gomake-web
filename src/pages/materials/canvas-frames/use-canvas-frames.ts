import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndCanvasFramesCategory,
  getAndSetAllAdditions,
  getAndSetCanvasFramesSizes,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useCanvasFrames = ({ item }: any) => {
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
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  useEffect(() => {
    getCategory();
    getAllAddition(item);
  }, [categoryName, supplierId]);

  const OnClickGetAllAddition = useCallback(async () => {
    const data = await getAndSetCanvasFramesSizes(
      callApi,
      setCanvasFramesSizes,
      {
        supplierId: item?.supplierId || "",
        categoryName: categoryName,
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item, categoryName, supplierId]);
  const getAllAddition = useCallback(
    async (item: any) => {
      const data = await getAndSetCanvasFramesSizes(
        callApi,
        setCanvasFramesSizes,
        {
          supplierId: item?.supplierId || "",
          categoryName: categoryName,
        }
      );
      return data;
    },
    [supplierId, categoryName, setCanvasFramesSizes]
  );

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const getAllAdditionRefetch = useCallback(
    async (item: any) => {
      const data = await getAndSetCanvasFramesSizes(callApi, undefined, {
        supplierId: item?.supplierId || "",
        categoryName: categoryName,
      });
      return data;
    },
    [supplierId, setCanvasFramesSizes]
  );
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
    getAllAddition,
    OnClickGetAllAddition,
    getAllAdditionRefetch,
    setCanvasFramesSizes,
  };
};
export { useCanvasFrames };
