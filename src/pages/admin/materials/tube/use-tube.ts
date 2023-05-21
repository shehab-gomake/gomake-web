import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetGetAllTube } from "@/services/hooks";

const useTube = () => {
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
  const [openAddNewTubeModal, setOpenAddNewTubeModal] = useState(false);
  const [openUpdateTubeModal, setOpenUpdateTubeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allTube, setAllTube] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewTubeWights, setIsAddNewTubeWights] = useState(false);
  const [selectedTubeWeight, setSelectedTubeWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      lenght: "",
      diameter: "",
      weight: "",
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
  const onChangeUpdateStateTubeSize = useCallback(
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
  const initialStateTubeWeights = (item: any) => {
    let temp = [...item?.tubeSizes];
    let final: any = [];
    temp.map((tubeSize) => {
      final[tubeSize?.id] = {
        ...tubeSize,
      };
    });

    setUpdateState(final);
  };

  const getTube = useCallback(async () => {
    await getAndSetGetAllTube(callApi, setAllTube);
  }, []);
  const onCloseAddNewTubeModal = () => {
    setOpenAddNewTubeModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewTubeModal(true);
  };
  const onCloseUpdateModal = async () => {
    getTube();
    setOpenUpdateTubeModal(false);
    setIsAddNewTubeWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateTubeWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateTubeModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedTubeWeight(item);
  };

  const addNewTubeSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/tube/add-tube`, {
      categoryName,
      tubeSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getTube();
      onCloseAddNewTubeModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewTubeSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/tube/add-tube-size?categoryName=${selectedItem?.categoryName}`,
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
        getTube();
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
  const deleteTubeSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/tube/delete-tube-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getTube();
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

  const updateTubeSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/tube/update-tube-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getTube();
  }, []);
  return {
    headerTable,
    allTube,
    openAddNewTubeModal,
    items,
    categoryName,
    openUpdateTubeModal,
    selectedEditItem,
    isAddNewTubeWights,
    openDeleteModal,
    selectedTubeWeight,
    updateState,
    onChangeUpdateStateTubeSize,
    onCloseAddNewTubeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewTubeSize,
    setOpenUpdateTubeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewTubeWights,
    addNewTubeSizeByCategoryName,
    deleteTubeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateTubeSize,
  };
};

export { useTube };
