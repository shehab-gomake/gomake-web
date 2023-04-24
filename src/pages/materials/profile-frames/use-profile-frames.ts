import { useCallback, useEffect, useMemo, useState } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  getAndSetProfileFrameCategores,
  getAndSetProfileFramesSize,
} from "@/services/hooks";
import { useTranslation } from "react-i18next";

const useProfileFrames = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [categoryName, setCategoryName] = useState("");
  const [profileFrameCategores, setProfileFrameCategores] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [profileFrameSizes, setProfileFrameSizes] = useState([]);

  const tabelHeaders = useMemo(
    () => [
      t("materials.profileFrames.code"),
      t("materials.profileFrames.height"),
      t("materials.profileFrames.width"),
      t("materials.profileFrames.stock"),
      t("materials.profileFrames.pricePerUnit"),
      t("materials.profileFrames.pricePerMeter"),
      t("materials.profileFrames.settings"),
    ],
    []
  );

  useEffect(() => {
    getProfileFrameSizes();
  }, [categoryName, supplierId]);
  useEffect(() => {
    getProfileFrameCategores();
  }, []);

  const getProfileFrameCategores = useCallback(async () => {
    const data = await getAndSetProfileFrameCategores(
      callApi,
      setProfileFrameCategores
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const getProfileFrameSizes = useCallback(async () => {
    if (categoryName?.length) {
      const data = await getAndSetProfileFramesSize(
        callApi,
        setProfileFrameSizes,
        {
          categoryName,
          supplierId: supplierId || "",
        }
      );
      return data;
    }
    return null;
  }, [categoryName, supplierId]);

  const onChangeCategory = useCallback(async (e: any, value: any) => {
    setCategoryName(value);
  }, []);

  const onChangeSupplier = useCallback(async (e: any, value: any) => {
    setSupplierId(value?.value);
  }, []);
  return {
    supplierId,
    tabelHeaders,
    profileFrameCategores,
    categoryName,
    profileFrameSizes,
    getProfileFrameSizes,
    setProfileFrameSizes,
    onChangeCategory,
    onChangeSupplier,
  };
};
export { useProfileFrames };
