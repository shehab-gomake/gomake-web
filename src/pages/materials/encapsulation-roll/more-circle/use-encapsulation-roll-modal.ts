import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getAndSetEncapsulationRollsSizes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { ShowSupplierList } from "@/store";

const useApplicationModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [encapsulationRollSizes, setEncapsulationRollSizes] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      t("materials.encapsulationRoll.code"),
      t("materials.encapsulationRoll.thickness"),
      t("materials.encapsulationRoll.sizeName"),
      t("materials.encapsulationRoll.pricePerSquareMeter"),
      t("materials.encapsulationRoll.stock"),
      t("materials.encapsulationRoll.settings"),
    ],
    []
  );
  const OnClickGetEncapsulationSizes = useCallback(async () => {
    const data = await getAndSetEncapsulationRollsSizes(
      callApi,
      setEncapsulationRollSizes,
      {
        categoryName: item?.categoryName,
        thicknessId: item?.thicknessId,
        supplierId: item?.supplierId || "",
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getEncapsulationSizes = useCallback(async (item: any) => {
    const data = await getAndSetEncapsulationRollsSizes(callApi, undefined, {
      categoryName: item?.categoryName,
      thicknessId: item?.thicknessId,
      supplierId: item?.supplierId || "",
    });

    return data;
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
    setShowUnderRowWidget({
      stateShow: false,
      widget: "",
      item: "",
      key: "",
    });
  };

  return {
    encapsulationRollSizes,
    categoryName,
    headerTable,
    openModal,
    OnClickGetEncapsulationSizes,
    setOpenModal,
    onCloseModal,
    getEncapsulationSizes,
  };
};

export { useApplicationModal };
