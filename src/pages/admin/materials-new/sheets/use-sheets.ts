import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetCategory, getAndSetGetAllNewSheets } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useSheets = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.categoryName"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const [openAddSheetModal, setOpenAddSheetModal] = useState(false);
  const [openUpdateSheetModal, setOpenUpdateSheetModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allSheets, setAllSheets] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewSheetWights, setIsAddNewSheetWights] = useState(false);
  const [isAddNewSheetWightSize, setIsAddNewSheetWightSize] = useState(false);
  const [selectedSheetWeight, setSelectedSheetWeight] = useState({});
  const [selectedSheetWeightSize, setSelectedSheetWeightSize] = useState({});
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
    let temp = [...items];
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
  const [updateState, setUpdateState] = useState([]);
  const onClickOpenSheetWeightSizeWidget = (item) => {
    setSelectedSheetWeightSize(item);
    setIsAddNewSheetWightSize(true);
    setItems([
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
  };
  const onChangeUpdateStateSheetWeights = useCallback(
    (index: string, filedName: string, value: any) => {
      let temp: any = { ...updateState };
      temp[`${index}`] = {
        ...temp[`${index}`],
        [filedName]: value,
      };
      setUpdateState(temp);
    },
    [updateState]
  );
  const initialStateSheetWeights = (item: any) => {
    let temp = [...item?.sheetWeights];
    let final: any = [];
    temp.map((sheetWeight) => {
      final[sheetWeight?.id] = {
        ...sheetWeight,
      };
      sheetWeight?.sheetSizes?.map((sheetSize) => {
        final[sheetSize?.id] = {
          ...sheetSize,
        };
      });
    });

    setUpdateState(final);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllNewSheets(callApi, setAllSheets);
  }, []);

  const [category, setCategory] = useState({});
  const getCategory = useCallback(async (categoryName: string) => {
    const data = await getAndSetCategory(callApi, setCategory, {
      categoryName,
    });
    initialStateSheetWeights(data);
    setSelectedEditItem(data);
    return data;
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddSheetModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddSheetModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheets();
    setOpenUpdateSheetModal(false);
    setIsAddNewSheetWights(false);
  };
  const onOpnUpdateModal = async (item) => {
    const data = await getCategory(item?.categoryName);
    initialStateSheetWeights(data);
    setSelectedEditItem(data);
    setOpenUpdateSheetModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedSheetWeight(item);
  };

  const addNewSupplierSheet = useCallback(async () => {
    const temp: any = items.map((item: any) => {
      const sheetSizes = item?.sheetSizes?.map((size: any) => {
        let tempSize = { ...size };
        delete tempSize.index;
        delete tempSize.code;
        return {
          ...tempSize,
          name: `${tempSize?.width}X${tempSize?.height}`,
        };
      });
      let tempItem = { ...item };
      delete tempItem.index;
      return {
        ...tempItem,
        name: tempItem.weight,
        sheetSizes,
      };
    });
    const res = await callApi("POST", `/v1/administrator/sheet/add-sheet`, {
      categoryName,
      sheetWeights: temp,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getSheets();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewSheeWeightByCategoryName = useCallback(
    async (selectedItem) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/add-sheet-weight?categoryName=${selectedItem?.categoryName}`,
        {
          ...items[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getSheets();
        await getCategory(selectedItem?.categoryName);
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [items]
  );
  const deleteSheetweight = useCallback(
    async (weightId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/delete-sheet-weight?categoryName=${categoryName}&weightId=${weightId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
        onCloseDeleteModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    []
  );
  const deleteSheetweightSize = useCallback(
    async (categoryName: string, weightId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/delete-sheet-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`
      );
      if (res?.success) {
        await getCategory(categoryName);
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        // getSheets();
        onCloseDeleteModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    []
  );
  const updateSheetweight = useCallback(
    async (weightId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/update-sheet-weight?categoryName=${categoryName}&weightId=${weightId}`,
        {
          ...updateState[weightId],
          name: `${updateState[weightId]?.weight}`,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getSheets();
        // onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );
  const updateSheetWeightSizes = useCallback(
    async (categoryName: string, weightId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/update-sheet-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`,
        {
          ...updateState[sizeId],
          name: `${updateState[sizeId]?.height}X${updateState[sizeId]?.width}`,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getSheets();
        // onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );
  const addNewSheeWeightSizeByCategoryName = useCallback(
    async (categoryName: string, weightId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/add-sheet-weight=size?categoryName=${categoryName}&weightId=${weightId}`,
        {
          ...items[0]?.sheetSizes[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
        getSheets();
        setIsAddNewSheetWightSize(false);
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [items]
  );
  useEffect(() => {
    getSheets();
  }, []);

  const [openDuplicateSheetModal, setOpenDuplicateSheetModal] = useState(false);
  const onOpnDuplicateModal = (item) => {
    initialStateSheetWeights(item);
    setSelectedEditItem(item);
    setOpenDuplicateSheetModal(true);
  };
  const onCloseDuplicateModal = () => {
    setOpenDuplicateSheetModal(false);
  };
  const duplicateWeight = useCallback(
    async (weightId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/duplicate-weight?categoryName=${categoryName}&weightId=${weightId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
        // getSheets();
        // onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );
  const duplicateWeightSize = useCallback(
    async (weightId: string, sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/duplicate-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
        // getSheets();
        // onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );

  return {
    headerTable,
    allSheets,
    openAddSheetModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    isAddNewSheetWightSize,
    selectedSheetWeightSize,
    onChangeUpdateStateSheetWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewSheeWeightByCategoryName,
    deleteSheetweight,
    deleteSheetweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetweight,
    updateSheetWeightSizes,
    setIsAddNewSheetWightSize,
    onClickOpenSheetWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
    openDuplicateSheetModal,
    onOpnDuplicateModal,
    onCloseDuplicateModal,
    getSheets,
    duplicateWeight,
    duplicateWeightSize,
  };
};

export { useSheets };
