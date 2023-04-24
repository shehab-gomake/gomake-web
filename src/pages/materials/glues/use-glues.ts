import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllGlues } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useGlues = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [allGlues, setAllGlues] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.glues.code"),
      t("materials.glues.typeName"),
      t("materials.glues.volumeInLiters"),
      t("materials.glues.weightPerLiter"),
      t("materials.glues.literInSquareMeter"),
      t("materials.glues.stock"),
      t("materials.glues.pricePerContainer"),
      t("materials.glues.pricePerLiter"),
      t("materials.glues.settings"),
    ],
    []
  );
  useEffect(() => {
    getAllGlues();
  }, [supplierId]);

  const onClickGlues = useCallback(async () => {
    const data = await getAndSetAllGlues(callApi, setAllGlues, {
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [supplierId]);
  const getAllGlues = useCallback(async () => {
    const data = await getAndSetAllGlues(callApi, setAllGlues, {
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

  return {
    tabelHeaders,
    supplierId,
    openModal,
    allGlues,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllGlues,
    onClickGlues,
    setAllGlues,
  };
};
export { useGlues };
