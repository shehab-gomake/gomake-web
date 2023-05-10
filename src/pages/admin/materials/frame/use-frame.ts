import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllFrames } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useFrame = () => {
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
  const [openAddNewFrameModal, setOpenAddNewFrameModal] = useState(false);
  const [openUpdateFrameModal, setOpenUpdateFrameModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allFrame, setAllFrame] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewFrameWights, setIsAddNewFrameWights] = useState(false);
  const [selectedFrameWeight, setSelectedFrameWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      color: "",
      width: "",
      height: "",
      thickness: "",
      weight: "",
      stock: "",
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
  const onChangeUpdateStateFrameSize = useCallback(
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
  const initialStateFrameWeights = (item: any) => {
    let temp = [...item?.frameSizes];
    let final: any = [];
    temp.map((frameSize) => {
      final[frameSize?.id] = {
        ...frameSize,
      };
    });

    setUpdateState(final);
  };

  const getFrame = useCallback(async () => {
    await getAndSetGetAllFrames(callApi, setAllFrame);
  }, []);
  const onCloseAddNewFrameModal = () => {
    setOpenAddNewFrameModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewFrameModal(true);
  };
  const onCloseUpdateModal = async () => {
    getFrame();
    setOpenUpdateFrameModal(false);
    setIsAddNewFrameWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateFrameWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateFrameModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedFrameWeight(item);
  };

  const addNewFrameSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/frame/add-frame`, {
      categoryName,
      frameSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getFrame();
      onCloseAddNewFrameModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewFrameSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/frame/add-frame-size?categoryName=${selectedItem?.categoryName}`,
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
        getFrame();
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
        `/v1/administrator/frame/delete-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getFrame();
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

  const updateFrameSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/frame/update-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getFrame();
  }, []);
  return {
    headerTable,
    allFrame,
    openAddNewFrameModal,
    items,
    categoryName,
    openUpdateFrameModal,
    selectedEditItem,
    isAddNewFrameWights,
    openDeleteModal,
    selectedFrameWeight,
    updateState,
    onChangeUpdateStateFrameSize,
    onCloseAddNewFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFrameSize,
    setOpenUpdateFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFrameWights,
    addNewFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  };
};

export { useFrame };
