import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllWideFormatMaterial } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useWideFormatMaterial = () => {
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
  const [openAddWideFormatMaterialModal, setOpenAddWideFormatMaterialModal] =
    useState(false);
  const [
    openUpdateWideFormatMaterialModal,
    setOpenUpdateWideFormatMaterialModal,
  ] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allWideFormatMaterial, setAllWideFormatMaterial] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewWideFormatMaterialType, setIsAddNewWideFormatMaterialType] =
    useState(false);
  const [
    isAddNewWideFormatMaterialTypeSize,
    setIsAddNewWideFormatMaterialTypeSize,
  ] = useState(false);
  const [
    selectedWideFormatMaterialWeight,
    setSelectedWideFormatMaterialWeight,
  ] = useState({});
  const [
    selectedWideFormatMaterialWeightSize,
    setSelectedWideFormatMaterialWeightSize,
  ] = useState({});
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

  const changeItemsWideFormatMaterialSize = (
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
  const onClickOpenWideFormatMaterialWeightSizeWidget = (item) => {
    setSelectedWideFormatMaterialWeightSize(item);
    setIsAddNewWideFormatMaterialTypeSize(true);
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
  const onChangeUpdateStateWideFormatMaterialWeights = useCallback(
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
  const initialStateWideFormatMaterialWeights = (item: any) => {
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

  const getWideFormatMaterial = useCallback(async () => {
    await getAndSetGetAllWideFormatMaterial(callApi, setAllWideFormatMaterial);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddWideFormatMaterialModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddWideFormatMaterialModal(true);
  };
  const onCloseUpdateModal = async () => {
    getWideFormatMaterial();
    setOpenUpdateWideFormatMaterialModal(false);
    setIsAddNewWideFormatMaterialType(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateWideFormatMaterialWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateWideFormatMaterialModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedWideFormatMaterialWeight(item);
  };

  const addNewSupplierWideFormatMaterial = useCallback(async () => {
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
      await getWideFormatMaterial();
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
        getWideFormatMaterial();
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
  const deleteWideFormatMaterialweight = useCallback(
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
        getWideFormatMaterial();
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
  const deleteWideFormatMaterialweightSize = useCallback(
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
        getWideFormatMaterial();
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
  const updateWideFormatMaterialweight = useCallback(
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
        // getWideFormatMaterial();
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
  const updateWideFormatMaterialWeightSizes = useCallback(
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
        getWideFormatMaterial();
        setIsAddNewWideFormatMaterialTypeSize(false);
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
    getWideFormatMaterial();
  }, []);
  return {
    headerTable,
    allWideFormatMaterial,
    openAddWideFormatMaterialModal,
    items,
    categoryName,
    openUpdateWideFormatMaterialModal,
    selectedEditItem,
    isAddNewWideFormatMaterialType,
    openDeleteModal,
    selectedWideFormatMaterialWeight,
    updateState,
    isAddNewWideFormatMaterialTypeSize,
    selectedWideFormatMaterialWeightSize,
    onChangeUpdateStateWideFormatMaterialWeights,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierWideFormatMaterial,
    changeItemsWideFormatMaterialSize,
    setOpenUpdateWideFormatMaterialModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewWideFormatMaterialType,
    addNewSheeWeightByCategoryName,
    deleteWideFormatMaterialweight,
    deleteWideFormatMaterialweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateWideFormatMaterialweight,
    updateWideFormatMaterialWeightSizes,
    setIsAddNewWideFormatMaterialTypeSize,
    onClickOpenWideFormatMaterialWeightSizeWidget,
    addNewSheeWeightSizeByCategoryName,
  };
};

export { useWideFormatMaterial };
