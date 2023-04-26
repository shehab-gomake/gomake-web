import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllLaminations } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useLaminations = () => {
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
  const [openAddSheetModal, setOpenAddSheetModal] = useState(false);
  const [openUpdateLaminationModal, setOpenUpdateLaminationModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allLaminations, setAllLaminations] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewLaminationSizes, setIsAddNewLaminationSizes] = useState(false);
  const [selectedLaminationSize, setSelectedLaminationSize] = useState({});
  const [items, setItems] = useState([
    {
      weight: "",
      name: "",
      thickness: "",
      index: "",
      sheetSizes: [
        {
          code: "",
          name: "",
          width: "",
          height: "",
          defaultPricePerTon: "",
          defaultPricePerUnit: "",
          direction: "",
          index: "",
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

  const changeItemsSheetSize = (
    sheetWeightIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetWeightIndex]["sheetSizes"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "sheetSizes", temp);
  };
  const [updateState, setUpdateState] = useState([]);
  const onChangeUpdateStateSheetWeights = useCallback(
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
  const initialStateLaminationSizes = (item: any) => {
    console.log("item", item);
    let temp = [...item?.laminationSizes];
    let final: any = [];
    temp.map((laminationSize) => {
      final[laminationSize?.id] = {
        ...laminationSize,
      };
      laminationSize?.laminationThicknesses?.map((laminationThicknes: any) => {
        final[laminationThicknes?.id] = {
          ...laminationThicknes,
        };
      });
    });

    setUpdateState(final);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllLaminations(callApi, setAllLaminations);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddSheetModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddSheetModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheets();
    setOpenUpdateLaminationModal(false);
    setIsAddNewLaminationSizes(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateLaminationSizes(item);
    setSelectedEditItem(item);
    setOpenUpdateLaminationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedLaminationSize(item);
  };

  const addNewSupplierSheet = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/sheet/add-sheet`, {
      categoryName,
      laminationSizes: items,
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
  }, [categoryName, items]);
  const addNewSheeWeightByCategoryName = useCallback(
    async (selectedItem) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/add-sheet-weight?categoryName=${selectedItem?.categoryName}`,
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
  const deleteLaminationSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/Administrator/DeleteLaminationSize?categoryName=${categoryName}&sizeId=${sizeId}`
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
  const deleteSheetweightSize = useCallback(
    async (categoryName: string, weightId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/delete-sheet-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`
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
  const updateSheetweight = useCallback(
    async (weightId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/update-sheet-weight?categoryName=${categoryName}&weightId=${weightId}`,
        {
          ...updateState[weightId],
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
  const updateSheetWeightSizes = useCallback(
    async (categoryName: string, weightId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/update-sheet-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`,
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
  useEffect(() => {
    getSheets();
  }, []);
  return {
    headerTable,
    allLaminations,
    openAddSheetModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationSizes,
    openDeleteModal,
    selectedLaminationSize,
    updateState,
    onChangeUpdateStateSheetWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationSizes,
    addNewSheeWeightByCategoryName,
    deleteLaminationSize,
    deleteSheetweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetweight,
    updateSheetWeightSizes,
  };
};

export { useLaminations };
