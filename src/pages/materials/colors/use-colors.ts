import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllColors } from "@/services/hooks";

const useColors = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [allColors, setAllColors] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.colors.code"),
      t("materials.colors.colorName"),
      t("materials.colors.volumeInLiters"),
      t("materials.colors.literInSquareMeter"),
      t("materials.colors.pricePerContainer"),
      t("materials.colors.stock"),
      t("materials.colors.pricePerLiter"),
      t("materials.colors.settings"),
    ],
    []
  );
  useEffect(() => {
    getAllColors();
  }, [supplierId]);

  const onClickColors = useCallback(async () => {
    const data = await getAndSetAllColors(callApi, setAllColors, {
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [supplierId]);
  const getAllColors = useCallback(async () => {
    const data = await getAndSetAllColors(callApi, setAllColors, {
      supplierId,
    });
    return data;
  }, [supplierId]);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
  };
  const getAllAdditionRefetch = useCallback(async () => {
    const data = await getAndSetAllColors(callApi, undefined, {
      supplierId,
    });
    return data;
  }, [supplierId, setAllColors]);
  return {
    tabelHeaders,
    supplierId,
    openModal,
    allColors,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllColors,
    onClickColors,
    getAllAdditionRefetch,
    setAllColors,
  };
};
export { useColors };
