import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllPlats } from "@/services/hooks";
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
  console.log("updateState", updateState);

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
    let temp = [...item?.platSizes];
    let final: any = [];
    temp.map((platSize) => {
      final[platSize?.id] = {
        ...platSize,
      };
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
        `/v1/administrator/plat/add-plat-size?categoryName=${selectedItem?.categoryName}`,
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
  const deletePlatSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/plat/delete-plat-size?categoryName=${categoryName}&sizeId=${sizeId}`
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

  const updatePlatSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/plat/update-plat-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
    setIsAddNewSheetWightSize,
    onClickOpenSheetWeightSizeWidget,
  };
};

export { useSheets };
