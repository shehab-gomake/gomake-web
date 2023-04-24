import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllVarnishs } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useColors = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [allVarnishs, setAllVarnishs] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.varnishs.code"),
      t("materials.varnishs.typeName"),
      t("materials.varnishs.volumeInLiters"),
      t("materials.varnishs.weightPerLiter"),
      t("materials.varnishs.literInSquareMeter"),
      t("materials.varnishs.stock"),
      t("materials.varnishs.pricePerContainer"),
      t("materials.varnishs.pricePerLiter"),
      t("materials.varnishs.settings"),
    ],
    []
  );
  useEffect(() => {
    getAllVarnishs();
  }, [supplierId]);

  const getAllVarnishs = useCallback(async () => {
    const data = await getAndSetAllVarnishs(callApi, setAllVarnishs, {
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
    allVarnishs,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllVarnishs,
    setAllVarnishs,
  };
};
export { useColors };
