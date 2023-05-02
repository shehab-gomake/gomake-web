import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllAdditions } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useApplications = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.additions.admin.name"),
      t("materials.additions.admin.settings"),
    ],
    []
  );
  const [openAddApplicationsModal, setOpenAddApplicationsModal] =
    useState(false);
  const [openUpdatalApplicationModal, setOpenUpdatalApplicationModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allAdditions, setAllAdditions] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [hardness, setHardness] = useState();
  const [isAddNewApplicationThickness, setIsAddNewApplicationThickness] =
    useState(false);
  const [selectedLaminationSize, setSelectedLaminationSize] = useState({});
  const [selecteApplicationThicknessSize, setSelecteApplicationThicknessSize] =
    useState({});
  const [isAddNeApplicationThicknessSize, setIsAddNewApplicationThicknessSize] =
    useState(false);
  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      adaptationField: "",
      defaultPrice: "",
      weight: "",
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

  const changeItemsApplicationThickness = (
    sheetWeightIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetWeightIndex]["applicationSizes"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "applicationSizes", temp);
  };
  const [updateState, setUpdateState] = useState({});

  const onChangeUpdateStateAddition = useCallback(
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
  const onClickOpenHardboardSizeThicknessWidget = (item) => {
    setSelecteApplicationThicknessSize(item);
    setIsAddNewApplicationThicknessSize(true);
    setItems([
      {
        code: "",
        name: "",
        adaptationField: "",
        defaultPrice: "",
        weight: "",
      },
    ]);
  };
  const initialStateApplicationThickness = (item: any) => {
    setUpdateState(item);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllAdditions(callApi, setAllAdditions);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddApplicationsModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        name: "",
        adaptationField: "",
        defaultPrice: "",
        weight: "",
      },
    ]);
    setOpenAddApplicationsModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheets();
    setOpenUpdatalApplicationModal(false);
    setIsAddNewApplicationThickness(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateApplicationThickness(item);
    setSelectedEditItem(item);
    setOpenUpdatalApplicationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedLaminationSize(item);
  };

  const addNewAddition = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-addition`, {
      ...items[0],
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
  }, [categoryName, hardness, items]);
  const addNewApplicationThicknessByCategoryName = useCallback(
    async (selectedItem) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/application/add-application-thickness?categoryName=${selectedItem?.categoryName}`,
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
        setIsAddNewApplicationThicknessSize(false);
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
  const deleteAddition = useCallback(async (code: string) => {
    const res = await callApi("POST", `/v1/administrator/delete-addition`, {
      code,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      getSheets();
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
        getSheets();
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
  const updateAddition = useCallback(
    async (code: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-addition?code=${code}`,
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
        // getSheets();
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
        // getSheets();
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
        getSheets();
        setIsAddNewApplicationThicknessSize(false);
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
  return {
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    hardness,
    openUpdatalApplicationModal,
    selectedEditItem,
    isAddNewApplicationThickness,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selecteApplicationThicknessSize,
    isAddNeApplicationThicknessSize,
    addNewApplicationThicknesSizeByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewApplicationThicknessSize,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewAddition,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteAddition,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
    updateApplicationThicknessSize,
  };
};

export { useApplications };
