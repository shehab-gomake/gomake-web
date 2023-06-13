import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getAndSetSheetSizes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { ShowSupplierList } from "@/store";

const useSheetModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [sheetSizes, setSheetSizes] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.code"),
      t("materials.sheetPaper.growingUp"),
      t("materials.sheetPaper.pricePerUnit"),
      t("materials.sheetPaper.pricePerTon"),
      t("materials.sheetPaper.direction"),
      t("materials.sheetPaper.stock"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const OnClickGetSheetSizes = useCallback(async () => {
    const data = await getAndSetSheetSizes(callApi, setSheetSizes, {
      categoryName: item?.categoryName,
      weightId: item?.weightId,
      supplierId: item?.supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getSheetSizes = useCallback(async (item: any) => {
    const data = await getAndSetSheetSizes(callApi, undefined, {
      categoryName: item?.categoryName,
      weightId: item?.weightId,
      supplierId: item?.supplierId,
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
    sheetSizes,
    categoryName,
    headerTable,
    openModal,
    OnClickGetSheetSizes,
    setOpenModal,
    onCloseModal,
    getSheetSizes,
  };
};

export { useSheetModal };
