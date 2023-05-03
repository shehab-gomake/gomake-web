import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllGanvasFrames } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useCanvasFrames = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.canvasFrames.admin.categoryName"),
      t("materials.canvasFrames.settings"),
    ],
    []
  );
  const [openAddNewPCanvasFrameModal, setOpenAddNewPCanvasFrameModal] =
    useState(false);
  const [openUpdatePlatModal, setOpenUpdatePlatModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allCanvasFrames, setAllCanvasFrames] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewCanvasFrameWights, setIsAddNewCanvasFrameWights] =
    useState(false);
  const [selectedPlatWeight, setSelectedPlatWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      defaultPrice: "",
      height: "",
      name: "",
      stock: "",
      thickness: "",
      weight: "",
      width: "",
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
  const onChangeUpdateStatePlatSize = useCallback(
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
  const initialStatePlatWeights = (item: any) => {
    let temp = [...item?.canvasFrameSizes];
    let final: any = [];
    temp.map((platSize) => {
      final[platSize?.id] = {
        ...platSize,
      };
    });

    setUpdateState(final);
  };

  const getPlats = useCallback(async () => {
    await getAndSetGetAllGanvasFrames(callApi, setAllCanvasFrames);
  }, []);
  const onCloseAddNewCanvasFrameModal = () => {
    setOpenAddNewPCanvasFrameModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPCanvasFrameModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPlats();
    setOpenUpdatePlatModal(false);
    setIsAddNewCanvasFrameWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStatePlatWeights(item);
    setSelectedEditItem(item);
    setOpenUpdatePlatModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedPlatWeight(item);
  };

  const addNewCanvasFrameSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-canvas-frame`, {
      categoryName,
      canvasFrameSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPlats();
      onCloseAddNewCanvasFrameModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewCanvasFrameSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/canvas-frame/add-canvas-frame-size?categoryName=${selectedItem?.categoryName}`,
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
  const deleteFrameSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-canvas-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
        getPlats();
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

  const updateFrameSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-canvas-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`,
        {
          ...updateState[sizeId],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
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
    allCanvasFrames,
    openAddNewPCanvasFrameModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewCanvasFrameWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewCanvasFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewCanvasFrameSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewCanvasFrameWights,
    addNewCanvasFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  };
};

export { useCanvasFrames };
