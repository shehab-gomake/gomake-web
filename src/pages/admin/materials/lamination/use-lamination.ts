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
  const [openAddLaminationModal, setOpenAddLaminationModal] = useState(false);
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
      code: "",
      fitToPrintType: "",
      height: "",
      name: "",
      width: "",
      laminationThicknesses: [
        {
          code: "",
          coldOrHot: "",
          defaultPrice: "",
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

  const changeItemsSheetSize = (
    sheetWeightIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetWeightIndex]["laminationThicknesses"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "laminationThicknesses", temp);
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
    setOpenAddLaminationModal(false);
  };
  const onOpnModalAdded = () => {
    setItems([
      {
        code: "",
        fitToPrintType: "",
        height: "",
        name: "",
        width: "",
        laminationThicknesses: [
          {
            code: "",
            coldOrHot: "",
            defaultPrice: "",
            thickness: "",
          },
        ],
      },
    ]);
    setOpenAddLaminationModal(true);
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

  const addNewSupplierLamination = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/add-lamination`, {
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
    openAddLaminationModal,
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
    addNewSupplierLamination,
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
