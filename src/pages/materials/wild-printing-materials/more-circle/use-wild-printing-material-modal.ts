import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getAndSetWildPrintingMaterialSizes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { ShowSupplierList } from "@/store";

const useWildPrintingMatieralsModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [sheetSizes, setSheetSizes] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      t("materials.wildPrintingMaterials.code"),
      t("materials.wildPrintingMaterials.size"),
      t("materials.wildPrintingMaterials.hardness"),
      t("materials.wildPrintingMaterials.thickness"),
      t("materials.wildPrintingMaterials.price"),
      t("materials.wildPrintingMaterials.stock"),
      t("materials.wildPrintingMaterials.settings"),
    ],
    []
  );
  const OnClickGetSheetSizes = useCallback(async () => {
    const data = await getAndSetWildPrintingMaterialSizes(
      callApi,
      setSheetSizes,
      {
        categoryName: item?.categoryName,
        typeId: item?.typeId,
        supplierId: item?.supplierId,
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
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
    sheetSizes,
    categoryName,
    headerTable,
    openModal,
    OnClickGetSheetSizes,
    setOpenModal,
    onCloseModal,
  };
};

export { useWildPrintingMatieralsModal };
