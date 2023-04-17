import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllDoubleSidedTapeRolls } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useDoubleSidedTapeRolls = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
  const [allDoubleSidedTapeRolls, setAllDoubleSidedTapeRolls] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const tabelHeaders = useMemo(
    () => [
      t("materials.doubleSidedTapeRolls.code"),
      t("materials.doubleSidedTapeRolls.name"),
      t("materials.doubleSidedTapeRolls.weightPerSquareMeter"),
      t("materials.doubleSidedTapeRolls.height"),
      t("materials.doubleSidedTapeRolls.stock"),
      t("materials.doubleSidedTapeRolls.pricePerUnit"),
      t("materials.doubleSidedTapeRolls.settings"),
    ],
    []
  );
  useEffect(() => {
    getAllDoubleSidedTapeRolls();
  }, [supplierId]);

  const onClickDoubleSidedTapeRolls = useCallback(async () => {
    const data = await getAndSetAllDoubleSidedTapeRolls(
      callApi,
      setAllDoubleSidedTapeRolls,
      {
        supplierId,
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [supplierId]);
  const getAllDoubleSidedTapeRolls = useCallback(async () => {
    const data = await getAndSetAllDoubleSidedTapeRolls(
      callApi,
      setAllDoubleSidedTapeRolls,
      {
        supplierId,
      }
    );
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
    allDoubleSidedTapeRolls,
    onChangeSupplier,
    setOpenModal,
    onCloseModal,
    getAllDoubleSidedTapeRolls,
    onClickDoubleSidedTapeRolls,
    setAllDoubleSidedTapeRolls,
  };
};
export { useDoubleSidedTapeRolls };
