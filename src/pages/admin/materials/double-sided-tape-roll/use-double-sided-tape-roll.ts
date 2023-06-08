import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllDoubleSidedTapeRoll } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useDoubleSidedTapeRoll = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.name"),
      t("materials.doubleSidedTapeRolls.admin.settings"),
    ],
    []
  );
  const [openAddApplicationsModal, setOpenAddApplicationsModal] =
    useState(false);
  const [
    openUpdateDoubleSidedTapeRollModal,
    setOpenUpdateDoubleSidedTapeRollModal,
  ] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allAdditions, setAllAdditions] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [selectedAddition, setSelectedAddition] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      width: "",
      height: "",
      weightPerSquareMeter: "",
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

  const [updateState, setUpdateState] = useState({});

  const onChangeUpdateStateDoubleSidedTapeRoll = useCallback(
    (filedName: string, value: any) => {
      setUpdateState((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [updateState]
  );

  const initialStateApplicationThickness = (item: any) => {
    setUpdateState(item);
  };

  const getDoubleSidedTapeRoll = useCallback(async () => {
    await getAndSetGetAllDoubleSidedTapeRoll(callApi, setAllAdditions);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddApplicationsModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        name: "",
        width: "",
        height: "",
        weightPerSquareMeter: "",
        defaultPricePerUnit: "",
      },
    ]);
    setOpenAddApplicationsModal(true);
  };
  const onCloseUpdateModal = async () => {
    getDoubleSidedTapeRoll();
    setOpenUpdateDoubleSidedTapeRollModal(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateApplicationThickness(item);
    setSelectedEditItem(item);
    setOpenUpdateDoubleSidedTapeRollModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedAddition(item);
  };

  const addDoubleSidedTapeRoll = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/add-double-sided-tape-roll`,
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
      await getDoubleSidedTapeRoll();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);

  const deleteDoubleSidedTapeRoll = useCallback(async (code: string) => {
    const res = await callApi(
      "POST",
      `/v1/administrator/delete-double-sided-tape-roll`,
      {
        code,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      getDoubleSidedTapeRoll();
      onCloseDeleteModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);

  const deleteApplicationThicknessSize = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-application-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getDoubleSidedTapeRoll();
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
  const updateDoubleSidedTapeRoll = useCallback(
    async (code: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-double-sided-tape-roll?code=${code}`,
        {
          ...updateState,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        // getDoubleSidedTapeRoll();
        // onCloseUpdateModal();
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
  const updateApplicationThicknessSize = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-application-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`,
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
        // getDoubleSidedTapeRoll();
        // onCloseUpdateModal();
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
  const addNewApplicationThicknesSizeByCategoryName = useCallback(
    async (categoryName: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/application/add-application-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}`,
        {
          //...items[0]?.applicationSizes[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getDoubleSidedTapeRoll();
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
    getDoubleSidedTapeRoll();
  }, []);
  return {
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdateDoubleSidedTapeRollModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    addNewApplicationThicknesSizeByCategoryName,
    onChangeUpdateStateDoubleSidedTapeRoll,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addDoubleSidedTapeRoll,
    setOpenUpdateDoubleSidedTapeRollModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteDoubleSidedTapeRoll,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateDoubleSidedTapeRoll,
    updateApplicationThicknessSize,
  };
};

export { useDoubleSidedTapeRoll };
