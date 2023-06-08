import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllPlats } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const usePlat = () => {
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
  const [openAddNewPlatModal, setOpenAddNewPlatModal] = useState(false);
  const [openUpdatePlatModal, setOpenUpdatePlatModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allPlats, setAllPlats] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewPlatWights, setIsAddNewPlatWights] = useState(false);
  const [selectedPlatWeight, setSelectedPlatWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

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
    setOpenUpdatePlatModal(false);
    setIsAddNewPlatWights(false);
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
  const addNewPlatSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
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
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPlatWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPlatWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  };
};

export { usePlat };
