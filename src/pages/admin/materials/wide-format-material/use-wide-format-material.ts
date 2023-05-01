import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllWideFormatMaterial } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useSheets = () => {
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
  const [openAddSheetModal, setOpenAddSheetModal] = useState(false);
  const [openUpdateSheetModal, setOpenUpdateSheetModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allWideFormatMaterial, setAllWideFormatMaterial] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewSheetWights, setIsAddNewSheetWights] = useState(false);
  const [isAddNewSheetWightSize, setIsAddNewSheetWightSize] = useState(false);
  const [selectedSheetWeight, setSelectedSheetWeight] = useState({});
  const [selectedSheetWeightSize, setSelectedSheetWeightSize] = useState({});
  const [items, setItems] = useState([
    {
      name: "",
      weightPerMeterSquare: "",
      thickness: "",
      hardness: "",
      index: "",
      wideFormatMaterialSizes: [
        {
          code: "",
          name: "",
          width: "",
          height: "",
          defaultPricePerMeterSquare: "",
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
    let temp = [...items[sheetWeightIndex]["wideFormatMaterialSizes"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetWeightIndex, "wideFormatMaterialSizes", temp);
  };
  const [updateState, setUpdateState] = useState([]);
  const onClickOpenSheetWeightSizeWidget = (item) => {
    setSelectedSheetWeightSize(item);
    setIsAddNewSheetWightSize(true);
    setItems([
      {
        name: "",
        weightPerMeterSquare: "",
        thickness: "",
        hardness: "",
        index: "",
        wideFormatMaterialSizes: [
          {
            code: "",
            name: "",
            width: "",
            height: "",
            defaultPricePerMeterSquare: "",
            index: "",
          },
        ],
      },
    ]);
  };
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
  const initialStateSheetWeights = (item: any) => {
    let temp = [...item?.wideFormatMaterialTypes];
    let final: any = [];
    temp.map((wideFormatMaterialType) => {
      final[wideFormatMaterialType?.id] = {
        ...wideFormatMaterialType,
      };
      wideFormatMaterialType?.wideFormatMaterialSizes?.map(
        (wideFormatMaterialSize) => {
          final[wideFormatMaterialSize?.id] = {
            ...wideFormatMaterialSize,
          };
        }
      );
    });

    setUpdateState(final);
  };

  const getSheets = useCallback(async () => {
    await getAndSetGetAllWideFormatMaterial(callApi, setAllWideFormatMaterial);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddSheetModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddSheetModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheets();
    setOpenUpdateSheetModal(false);
    setIsAddNewSheetWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateSheetWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateSheetModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedSheetWeight(item);
  };

  const addNewSupplierSheet = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/wide-format-material/add-wide-format-material`,
      {
        categoryName,
        wideFormatMaterialTypes: items,
      }
    );
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
        `/v1/administrator/wide-format-material/add-wide-format-material-type?categoryName=${selectedItem?.categoryName}`,
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
  const deleteSheetweight = useCallback(
    async (typeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/wide-format-material/delete-wide-format-material-type?categoryName=${categoryName}&typeId=${typeId}`
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
    async (categoryName: string, typeId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/wide-format-material/delete-wide-format-material-type-size?categoryName=${categoryName}&typeId=${typeId}&sizeId=${sizeId}`
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
    async (typeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/wide-format-material/update-wide-format-material-type?categoryName=${categoryName}&typeId=${typeId}`,
        {
          ...updateState[typeId],
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
    async (categoryName: string, typeId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/wide-format-material/update-wide-format-material-type-size?categoryName=${categoryName}&typeId=${typeId}&sizeId=${sizeId}`,
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
    async (categoryName: string, typeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/wide-format-material/add-wide-format-material-type-size?categoryName=${categoryName}&typeId=${typeId}`,
        {
          ...items[0]?.wideFormatMaterialSizes[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getSheets();
        setIsAddNewSheetWightSize(false);
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
    allWideFormatMaterial,
    openAddSheetModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    isAddNewSheetWightSize,
    selectedSheetWeightSize,
    onChangeUpdateStateSheetWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierSheet,
    changeItemsSheetSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewSheeWeightByCategoryName,
    deleteSheetweight,
    deleteSheetweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetweight,
    updateSheetWeightSizes,
    setIsAddNewSheetWightSize,
    onClickOpenSheetWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  };
};

export { useSheets };
