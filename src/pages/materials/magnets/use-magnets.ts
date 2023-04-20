import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllMagnets } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useColors = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [allMagnets, setAllMagnets] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.magnets.code"),
      t("materials.magnets.name"),
      t("materials.magnets.weight"),
      t("materials.magnets.withGlue"),
      t("materials.magnets.directPrinting"),
      t("materials.magnets.height"),
      t("materials.magnets.width"),
      t("materials.magnets.stock"),
      t("materials.magnets.price"),
      t("materials.magnets.settings"),
    ],
    []
  );
  useEffect(() => {
    getAllMagnets();
  }, [supplierId]);

  const onClickMagnets = useCallback(async () => {
    const data = await getAndSetAllMagnets(callApi, setAllMagnets, {
      supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [supplierId]);
  const getAllMagnets = useCallback(async () => {
    const data = await getAndSetAllMagnets(callApi, setAllMagnets, {
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
    allMagnets,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllMagnets,
    onClickMagnets,
    setAllMagnets,
  };
};
export { useColors };
