import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllSheets } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useSheets = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.admin.categoryName"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const [openAddSheetModal, setOpenAddSheetModal] = useState(false);
  const [allSheets, setAllSheets] = useState([]);

  const [items, setItems] = useState([
    {
      weight: "",
      name: "",
      thickness: "",
      index: "",
    },
  ]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index][filedName] = value;
    setItems(temp);
  };

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
    items,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
  };
};

export { useSheets };
