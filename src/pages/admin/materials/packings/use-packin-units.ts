import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndsetAllPackins } from "@/services/hooks";
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
  const [openAddNewPackingModal, setOpenAddNewPackingModal] = useState(false);
  const [openUpdatePlatModal, setOpenUpdatePlatModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allPackin, setAllPackin] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewPackingVolume, setIsAddNewPackingVolume] = useState(false);
  const [selectedPlatWeight, setSelectedPlatWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      width: "",
      height: "",
      length: "",
      weight: "",
      defaultPricePerUnit: "",
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
  const onChangeUpdateStatePackingVolume = useCallback(
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
  const initialStatePackingVolumn = (item: any) => {
    let temp = [...item?.packingVolumes];
    let final: any = [];
    temp.map((platSize) => {
      final[platSize?.id] = {
        ...platSize,
      };
    });

    setUpdateState(final);
  };

  const getPlats = useCallback(async () => {
    await getAndsetAllPackins(callApi, setAllPackin);
  }, []);
  const onCloseAddNewPackingsModal = () => {
    setOpenAddNewPackingModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPackingModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPlats();
    setOpenUpdatePlatModal(false);
    setIsAddNewPackingVolume(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStatePackingVolumn(item);
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

  const addNewPacking = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-packing`, {
      categoryName,
      packingVolumes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPlats();
      onCloseAddNewPackingsModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewPackingVolumeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/packing-volume/add-packing-volume?categoryName=${selectedItem?.categoryName}`,
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
  const deletePackingVolume = useCallback(
    async (volumeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-packing-volume?categoryName=${categoryName}&volumeId=${volumeId}`
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

  const updatePackingVolume = useCallback(
    async (volumeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-packing-volume?categoryName=${categoryName}&volumeId=${volumeId}`,
        {
          ...updateState[volumeId],
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
    allPackin,
    openAddNewPackingModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackingVolume,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackingVolume,
    onCloseAddNewPackingsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPacking,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackingVolume,
    addNewPackingVolumeByCategoryName,
    deletePackingVolume,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackingVolume,
  };
};

export { useCanvasFrames };
