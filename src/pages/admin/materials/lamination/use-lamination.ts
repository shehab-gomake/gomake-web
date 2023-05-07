import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllLaminations } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useLamination = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.admin.categoryName"),
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
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
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
      let temp: any = { ...updateState };
      temp[`${index}`] = {
        ...temp[`${index}`],
        [filedName]: value,
      };
      setUpdateState(temp);
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
    await getAndSetGetAllLaminations(callApi, setAllLamination);
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
  const onOpnUpdateModal = (item) => {
    initialStateLaminationWeights(item);
    setSelectedEditItem(item);
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
        getLamination();
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
        getLamination();
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
        getLamination();
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
  };
};

export { useLamination };
