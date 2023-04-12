import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndCanvasFramesCategory,
  getAndSetAllAdditions,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useCanvasFrames = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [CanvasFramesCategories, setCanvasFramesCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [allAdditions, setAllAdditions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const tabelHeaders = useMemo(
    () => [
      t("materials.additions.code"),
      t("materials.additions.name"),
      t("materials.additions.weight"),
      t("materials.additions.adaptationField"),
      t("materials.additions.stock"),
      t("materials.additions.price"),
      t("materials.additions.settings"),
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
    const data = await getAndSetAllAdditions(callApi, setAllAdditions, {
      supplierId: item?.supplierId || "",
    });
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getAllAddition = useCallback(
    async (item: any) => {
      const data = await getAndSetAllAdditions(callApi, setAllAdditions, {
        supplierId: item?.supplierId || "",
      });
      return data;
    },
    [supplierId, setAllAdditions]
  );

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const getAllAdditionRefetch = useCallback(
    async (item: any) => {
      const data = await getAndSetAllAdditions(callApi, undefined, {
        supplierId: item?.supplierId || "",
      });
      return data;
    },
    [supplierId, setAllAdditions]
  );
  return {
    tabelHeaders,
    supplierId,
    allAdditions,
    openModal,
    CanvasFramesCategories,
    categoryName,
    onChangeCategory,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllAddition,
    OnClickGetAllAddition,
    getAllAdditionRefetch,
    setAllAdditions,
  };
};
export { useCanvasFrames };
