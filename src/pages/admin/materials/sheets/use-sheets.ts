import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllSheets } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheets = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [openAddSheetModal, setOpenAddSheetModal] = useState(false);
  const [allSheets, setAllSheets] = useState([]);
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.admin.categoryName"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );

  const getCategory = useCallback(async () => {
    await getAndSetGetAllSheets(callApi, setAllSheets);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddSheetModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddSheetModal(true);
  };
  useEffect(() => {
    getCategory();
  }, []);

  return {
    headerTable,
    allSheets,
    openAddSheetModal,
    onCloseModalAdded,
    onOpnModalAdded,
  };
};

export { useSheets };
