import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllPlats, getAndSetGetAllSheets } from "@/services/hooks";
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
  const [openAddNewPlatModal, setOpenAddNewPlatModal] = useState(false);
  const [openUpdateSheetModal, setOpenUpdateSheetModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allPlats, setAllPlats] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewSheetWights, setIsAddNewSheetWights] = useState(false);
  const [isAddNewSheetWightSize, setIsAddNewSheetWightSize] = useState(false);
  const [selectedSheetWeight, setSelectedSheetWeight] = useState({});
  const [selectedSheetWeightSize, setSelectedSheetWeightSize] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      width: "",
      height: "",
      defaultPrice: "",
    },
  ]);
  console.log("items", items);
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
        code: "",
        name: "",
        width: "",
        height: "",
        defaultPrice: "",
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

  const getPlats = useCallback(async () => {
    await getAndSetGetAllPlats(callApi, setAllPlats);
  }, []);
  const onCloseAddNewPlatModal = () => {
    setOpenAddNewPlatModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPlatModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPlats();
    setOpenUpdateSheetModal(false);
    setIsAddNewSheetWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateSheetWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateSheetModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedSheetWeight(item);
  };

  const addNewPlatsSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/plat/add-plat`, {
      categoryName,
      platSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPlats();
      onCloseAddNewPlatModal();
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
        getPlats();
        onCloseUpdateModal();
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
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getPlats();
        onCloseDeleteModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
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
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getPlats();
        onCloseDeleteModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
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
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getPlats();
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
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getPlats();
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
          // ...items[0]?.sheetSizes[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getPlats();
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
    getPlats();
  }, []);
  return {
    headerTable,
    allPlats,
    openAddNewPlatModal,
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
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
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
  };
};

export { useSheets };
