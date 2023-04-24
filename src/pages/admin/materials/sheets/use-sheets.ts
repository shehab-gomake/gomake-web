import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllSheets } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useSheets = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
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
  const [categoryName, setCategoryName] = useState("");
  const [items, setItems] = useState([
    {
      weight: "",
      name: "",
      thickness: "",
      index: "",
      sheetSizes: [
        {
          code: "",
          name: "",
          width: "",
          height: "",
          defaultPricePerTon: "",
          defaultPricePerUnit: "",
          direction: "",
          index: "",
        },
      ],
    },
  ]);

  const changeItems = (index: number, filedName: string, value: any) => {
    console.log("index", index);
    console.log("filedName", filedName);
    console.log("value", value);
    let temp = [...items];
    console.log("temp", temp);
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };

  const changeItemsSheetSize = (
    sheetWeightIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetWeightIndex]["sheetSizes"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "sheetSizes", temp);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllSheets(callApi, setAllSheets);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddSheetModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddSheetModal(true);
  };

  const addNewSupplierSheet = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/sheet/add-sheet`, {
      categoryName,
      sheetWeights: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      getSheets();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  useEffect(() => {
    getSheets();
  }, []);
  return {
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
  };
};

export { useSheets };
