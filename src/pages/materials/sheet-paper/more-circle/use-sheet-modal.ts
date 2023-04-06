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
      "Code",
      "Growing Up",
      "price Per Unit",
      "price Per Ton",
      "direction",
      "stock",
      "settings",
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

export { useSheetModal };
