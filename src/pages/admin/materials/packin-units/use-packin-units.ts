import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllPackinUnits } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useCanvasFrames = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.categoryName"),
      t("materials.canvasFrames.settings"),
    ],
    []
  );
  const [openAddNewPackinUnitModal, setOpenAddNewPackinUnitModal] =
    useState(false);
  const [openUpdatePlatModal, setOpenUpdatePlatModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allPackinUnit, setAllPackinUnit] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewPackinUnitSize, setIsAddNewPackinUnitSize] = useState(false);
  const [selectedPlatWeight, setSelectedPlatWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      material: "",
      size: "",
      sizeName: "",
      width: "",
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
  const onChangeUpdateStatePackinUnitSize = useCallback(
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
  const initialStatePackinUnitSize = (item: any) => {
    let temp = [...item?.packinUnitSizes];
    let final: any = [];
    temp.map((platSize) => {
      final[platSize?.id] = {
        ...platSize,
      };
    });

    setUpdateState(final);
  };

  const getPlats = useCallback(async () => {
    await getAndSetGetAllPackinUnits(callApi, setAllPackinUnit);
  }, []);
  const onCloseAddNewPackinUnitsModal = () => {
    setOpenAddNewPackinUnitModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPackinUnitModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPlats();
    setOpenUpdatePlatModal(false);
    setIsAddNewPackinUnitSize(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStatePackinUnitSize(item);
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

  const addNewPackinUnitSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-packin-unit`, {
      categoryName,
      packinUnitSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPlats();
      onCloseAddNewPackinUnitsModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewPackinUnitSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/packin-unit/add-packin-unit-size?categoryName=${selectedItem?.categoryName}`,
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
  const deletePackinUnitSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-packin-unit-size?categoryName=${categoryName}&sizeId=${sizeId}`
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

  const updatePackinUnitSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-packin-unit-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    allPackinUnit,
    openAddNewPackinUnitModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPackinUnitSize,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePackinUnitSize,
    onCloseAddNewPackinUnitsModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinUnitSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinUnitSize,
    addNewPackinUnitSizeByCategoryName,
    deletePackinUnitSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinUnitSize,
  };
};

export { useCanvasFrames };
