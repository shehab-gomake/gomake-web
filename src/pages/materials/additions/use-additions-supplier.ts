import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { getAndSetAllAdditions } from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useAdditionsSupplier = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [supplierId, setSupplierId] = useState("");
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

  const OnClickGetAllAddition = useCallback(async (item: any) => {
    const data = await getAndSetAllAdditions(callApi, setAllAdditions, {
      supplierId: item?.supplierId || "",
    });
    if (data) {
      setOpenModal(true);
    }
  }, []);
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
    onChangeSupplier,
    openModal,
    setOpenModal,
    onCloseModal,
    getAllAddition,
    OnClickGetAllAddition,
    getAllAdditionRefetch,
  };
};
export { useAdditionsSupplier };
