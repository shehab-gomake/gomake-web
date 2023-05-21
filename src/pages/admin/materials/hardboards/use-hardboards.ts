import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllHardboards } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useHardboards = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.categoryName"),
      t("materials.lamination.admin.settings"),
    ],
    []
  );
  const [openAddHardboardsModal, setOpenAddLaminationModal] = useState(false);
  const [openUpdateHardboardModal, setOpenUpdateHardboardModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allLaminations, setAllLaminations] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [hardness, setHardness] = useState();
  const [isAddNewHardboardSizes, setIsAddNewHardboardSizes] = useState(false);
  const [selectedLaminationSize, setSelectedLaminationSize] = useState({});
  const [selectedHardboardSizeThicknes, setSelectedHardboardSizeThicknes] =
    useState({});
  const [isAddNewHardboardSizeThickness, setIsAddNewHardboardSizeThickness] =
    useState(false);
  const [items, setItems] = useState([
    {
      height: "",
      name: "",
      width: "",
      hardboardThicknesses: [
        {
          code: "",
          defaultPricePerSquareMeter: "",
          index: "",
          name: "",
          thickness: "",
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

  const changeItemsHardboardnSize = (
    sheetWeightIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetWeightIndex]["hardboardThicknesses"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "hardboardThicknesses", temp);
  };
  const [updateState, setUpdateState] = useState([]);
  const onChangeUpdateStateHardboardWeights = useCallback(
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
    setSelectedHardboardSizeThicknes(item);
    setIsAddNewHardboardSizeThickness(true);
    setItems([
      {
        height: "",
        name: "",
        width: "",
        hardboardThicknesses: [
          {
            code: "",
            defaultPricePerSquareMeter: "",
            index: "",
            name: "",
            thickness: "",
          },
        ],
      },
    ]);
  };
  const initialStateHardboardSizes = (item: any) => {
    let temp = [...item?.hardboardSizes];
    let final: any = [];
    temp.map((hardboardSize) => {
      final[hardboardSize?.id] = {
        ...hardboardSize,
      };
      hardboardSize?.hardboardThicknesses?.map((hardboardThicknes: any) => {
        final[hardboardThicknes?.id] = {
          ...hardboardThicknes,
        };
      });
    });

    setUpdateState(final);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllHardboards(callApi, setAllLaminations);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddLaminationModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        height: "",
        name: "",
        width: "",
        hardboardThicknesses: [
          {
            code: "",
            defaultPricePerSquareMeter: "",
            index: "",
            name: "",
            thickness: "",
          },
        ],
      },
    ]);
    setOpenAddLaminationModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheets();
    setOpenUpdateHardboardModal(false);
    setIsAddNewHardboardSizes(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateHardboardSizes(item);
    setSelectedEditItem(item);
    setOpenUpdateHardboardModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedLaminationSize(item);
  };

  const addNewSupplierHardboard = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-hardboard`, {
      categoryName,
      hardness,
      hardboardSizes: items,
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
  const addNewHardboardSizeByCategoryName = useCallback(
    async (selectedItem) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/hardboard/add-hardboard-size?categoryName=${selectedItem?.categoryName}`,
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
        setIsAddNewHardboardSizeThickness(false);
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
  const deleteHardboardSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-hardboard-size?categoryName=${categoryName}&sizeId=${sizeId}`
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
  const deletelHardboardSizeThickness = useCallback(
    async (categoryName: string, thicknessId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/delete-hardboard-size-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`
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
  const UpdateHardboardSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-hardboard-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
        // getSheets();
        // onCloseUpdateModal();
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
  const updateHardboardSizeThickness = useCallback(
    async (categoryName: string, thicknessId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/update-hardboard-size-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`,
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
  const addNewHardboardSizeThicknesByCategoryName = useCallback(
    async (categoryName: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/hardboard/add-hardboard-size-thickness?categoryName=${categoryName}&sizeId=${sizeId}`,
        {
          ...items[0]?.hardboardThicknesses[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getSheets();
        setIsAddNewHardboardSizeThickness(false);
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
    allLaminations,
    openAddHardboardsModal,
    items,
    categoryName,
    hardness,
    openUpdateHardboardModal,
    selectedEditItem,
    isAddNewHardboardSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    selectedHardboardSizeThicknes,
    isAddNewHardboardSizeThickness,
    addNewHardboardSizeThicknesByCategoryName,
    onClickOpenHardboardSizeThicknessWidget,
    setIsAddNewHardboardSizeThickness,
    onChangeUpdateStateHardboardWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    setHardness,
    addNewSupplierHardboard,
    changeItemsHardboardnSize,
    setOpenUpdateHardboardModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewHardboardSizes,
    addNewHardboardSizeByCategoryName,
    deleteHardboardSize,
    deletelHardboardSizeThickness,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    UpdateHardboardSize,
    updateHardboardSizeThickness,
  };
};

export { useHardboards };
