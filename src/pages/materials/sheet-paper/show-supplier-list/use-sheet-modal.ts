import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetSheetSizes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheetModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const [sheetSizes, setSheetSizes] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      "Code",
      "Growing Up",
      "pricePerUnit",
      "pricePerTon",
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

  return {
    sheetSizes,
    categoryName,
    headerTable,
    openModal,
    OnClickGetSheetSizes,
    setOpenModal,
  };
};

export { useSheetModal };
