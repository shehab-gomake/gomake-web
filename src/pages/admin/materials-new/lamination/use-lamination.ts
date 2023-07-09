import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetGetAllLaminations,
  getAndSetGetAllNewLaminations,
} from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetCategory } from "@/services/hooks/admin-side/get-set-lamination";

const useLamination = () => {
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
  const [openAddLaminationModal, setOpenAddLaminationModal] = useState(false);
  const [openUpdateLaminationModal, setOpenUpdateLaminationModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allLamination, setAllLamination] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewLaminationWights, setIsAddNewLaminationWights] =
    useState(false);
  const [isAddNewLaminationWightSize, setIsAddNewLaminationWightSize] =
    useState(false);
  const [selectedLaminationWeight, setSelectedLaminationWeight] = useState({});
  const [selectedLaminationWeightSize, setSelectedLaminationWeightSize] =
    useState({});
  const [items, setItems] = useState([
    {
      code: "",
      width: "",
      height: "",
      name: "",
      laminationThicknesses: [
        {
          code: "",
          thickness: "",
          defaultPrice: "",
          coldOrHot: "",
        },
      ],
      fitToPrintType: [],
    },
  ]);
  const changeItems = (index: number, filedName: string, value: any) => {
    setItems((prev) => {
      let temp = [...prev];
      temp[index] = {
        ...temp[index],
        [filedName]: value,
      };
      return temp;
    });
  };

  const changeItemsLaminationSize = (
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
  const onClickOpenLaminationWeightSizeWidget = (item) => {
    setSelectedLaminationWeightSize(item);
    setIsAddNewLaminationWightSize(true);
    setItems([
      {
        code: "",
        width: "",
        height: "",
        name: "",
        laminationThicknesses: [
          {
            code: "",
            thickness: "",
            defaultPrice: "",
            coldOrHot: "",
          },
        ],
        fitToPrintType: [],
      },
    ]);
  };
  const onChangeUpdateStateLaminationWeights = useCallback(
    (index: string, filedName: string, value: any) => {
      setUpdateState((prev: any) => {
        let temp: any = { ...prev };
        temp[`${index}`] = {
          ...temp[`${index}`],
          [filedName]: value,
        };
        return temp;
      });
    },
    [updateState]
  );
  const initialStateLaminationWeights = (item: any) => {
    let temp = [...item?.laminationSizes];
    let final: any = [];
    temp.map((laminationSize) => {
      final[laminationSize?.id] = {
        ...laminationSize,
      };
      laminationSize?.laminationThicknesses?.map(
        (laminationThicknesse: any) => {
          final[laminationThicknesse?.id] = {
            ...laminationThicknesse,
          };
        }
      );
    });

    setUpdateState(final);
  };

  const getLamination = useCallback(async () => {
    await getAndSetGetAllNewLaminations(callApi, setAllLamination);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddLaminationModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddLaminationModal(true);
  };
  const onCloseUpdateModal = async () => {
    getLamination();
    setOpenUpdateLaminationModal(false);
    setIsAddNewLaminationWights(false);
  };
  const onOpnUpdateModal = async (item) => {
    const data = await getCategory(item?.categoryName);
    initialStateLaminationWeights(data);
    setSelectedEditItem(data);
    setOpenUpdateLaminationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedLaminationWeight(item);
  };

  const addNewSupplierLamination = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/lamination/add-lamination`,
      {
        categoryName,
        laminationSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getLamination();
      await getCategory(categoryName);
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
        `/v1/administrator/lamination/add-lamination-size?categoryName=${selectedItem?.categoryName}`,
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
        // getLamination();
        await getCategory(selectedItem?.categoryName);
        // onCloseUpdateModal();
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
  const deleteLaminationweight = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/lamination/delete-lamination-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getLamination();
        await getCategory(categoryName);
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
  const deleteLaminationweightSize = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/lamination/delete-lamination-size-thickness?categoryName=${categoryName}&sizeId=${sizeId}&thicknessId=${thicknessId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getLamination();
        await getCategory(categoryName);
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
  const updateLaminationweight = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/lamination/update-lamination-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
        // getLamination();
        await getCategory(categoryName);
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
  const updateLaminationWeightSizes = useCallback(
    async (categoryName: string, sizeId: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/lamination/update-lamination-size-thickness?categoryName=${categoryName}&sizeId=${sizeId}&thicknessId=${thicknessId}`,
        {
          ...updateState[thicknessId],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getLamination();
        await getCategory(categoryName);
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
  const addNewSheeWeightSizeByCategoryName = useCallback(
    async (categoryName: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/lamination/add-lamination-size-thickness?categoryName=${categoryName}&sizeId=${sizeId}`,
        {
          ...items[0]?.laminationThicknesses[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getLamination();
        await getCategory(categoryName);
        setIsAddNewLaminationWightSize(false);
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
    getLamination();
  }, []);

  const [category, setCategory] = useState({});
  const getCategory = useCallback(async (categoryName: string) => {
    const data = await getAndSetCategory(callApi, setCategory, {
      categoryName,
    });
    console.log("datadatadatadatadatadatadatadata", data);
    initialStateLaminationWeights(data);
    setSelectedEditItem(data);
    return data;
  }, []);

  const [openDuplicateSheetModal, setOpenDuplicateSheetModal] = useState(false);
  const onOpnDuplicateModal = (item) => {
    initialStateLaminationWeights(item);
    setSelectedEditItem(item);
    setOpenDuplicateSheetModal(true);
  };
  const onCloseDuplicateModal = () => {
    setOpenDuplicateSheetModal(false);
  };
  const duplicateWeight = useCallback(
    async (weightId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/duplicate-weight?categoryName=${categoryName}&weightId=${weightId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
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
  const duplicateWeightSize = useCallback(
    async (weightId: string, sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet/duplicate-weight-size?categoryName=${categoryName}&weightId=${weightId}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        await getCategory(categoryName);
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

  return {
    headerTable,
    allLamination,
    openAddLaminationModal,
    items,
    categoryName,
    openUpdateLaminationModal,
    selectedEditItem,
    isAddNewLaminationWights,
    openDeleteModal,
    selectedLaminationWeight,
    updateState,
    isAddNewLaminationWightSize,
    selectedLaminationWeightSize,
    onChangeUpdateStateLaminationWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierLamination,
    changeItemsLaminationSize,
    setOpenUpdateLaminationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewLaminationWights,
    addNewSheeWeightByCategoryName,
    deleteLaminationweight,
    deleteLaminationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateLaminationweight,
    updateLaminationWeightSizes,
    setIsAddNewLaminationWightSize,
    onClickOpenLaminationWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
    getCategory,
    openDuplicateSheetModal,
    onOpnDuplicateModal,
    onCloseDuplicateModal,
    duplicateWeight,
    duplicateWeightSize,
  };
};

export { useLamination };
