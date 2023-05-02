import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllApplications } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useApplications = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.lamination.admin.categoryName"),
      t("materials.lamination.admin.settings"),
    ],
    []
  );
  const [openAddApplicationsModal, setOpenAddApplicationsModal] =
    useState(false);
  const [openUpdatalApplicationModal, setOpenUpdatalApplicationModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allApplications, setAllApplications] = useState([]);
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
      thickness: "",
      weightPerSquareMeter: "",
      applicationSizes: [
        {
          code: "",
          defaultPricePerSquareMeter: "",
          height: "",
          name: "",
          width: "",
        },
      ],
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
  const [updateState, setUpdateState] = useState([]);
  const onChangeUpdateStateApplicationThickness = useCallback(
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
  const onClickOpenHardboardSizeThicknessWidget = (item) => {
    setSelecteApplicationThicknessSize(item);
    setIsAddNewApplicationThicknessSize(true);
    setItems([
      {
        code: "",
        name: "",
        thickness: "",
        weightPerSquareMeter: "",
        applicationSizes: [
          {
            code: "",
            defaultPricePerSquareMeter: "",
            height: "",
            name: "",
            width: "",
          },
        ],
      },
    ]);
  };
  const initialStateApplicationThickness = (item: any) => {
    let temp = [...item?.applicationThicknesses];
    let final: any = [];
    temp.map((applicationThickness) => {
      final[applicationThickness?.id] = {
        ...applicationThickness,
      };
      applicationThickness?.applicationSizes?.map((applicationSize: any) => {
        final[applicationSize?.id] = {
          ...applicationSize,
        };
      });
    });

    setUpdateState(final);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllApplications(callApi, setAllApplications);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddApplicationsModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        name: "",
        thickness: "",
        weightPerSquareMeter: "",
        applicationSizes: [
          {
            code: "",
            defaultPricePerSquareMeter: "",
            height: "",
            name: "",
            width: "",
          },
        ],
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

  const addNewSupplierApplication = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-application`, {
      categoryName,
      applicationThicknesses: items,
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
  const deleteApplicationThickness = useCallback(
    async (thicknessId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-application-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}`
      );
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
    },
    []
  );
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
  const updateApplicationThickness = useCallback(
    async (thicknessId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-application-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}`,
        {
          ...updateState[thicknessId],
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
          ...items[0]?.applicationSizes[0],
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
    allApplications,
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
    onChangeUpdateStateApplicationThickness,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierApplication,
    changeItemsApplicationThickness,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewApplicationThickness,
    addNewApplicationThicknessByCategoryName,
    deleteApplicationThickness,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateApplicationThickness,
    updateApplicationThicknessSize,
  };
};

export { useApplications };
