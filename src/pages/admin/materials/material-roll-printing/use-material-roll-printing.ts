import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetGetAllMaterialRollPrinting } from "@/services/hooks";

const useMaterialRollPrinting = () => {
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
  const [
    openAddNewMaterialRollPrintingModal,
    setOpenAddNewMaterialRollPrintingModal,
  ] = useState(false);
  const [
    openUpdateMaterialRollPrintingModal,
    setOpenUpdateMaterialRollPrintingModal,
  ] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allAllMaterialRollPrinting, setAllMaterialRollPrinting] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [
    isAddNewMaterialRollPrintingWights,
    setIsAddNewMaterialRollPrintingWights,
  ] = useState(false);
  const [
    selectedMaterialRollPrintingWeight,
    setSelectedMaterialRollPrintingWeight,
  ] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      width: "",
      height: "",
      weightPerSquareMeter: "",
      withPremier: false,
      stock: "",
      defaultPricePerSquareMeter: "",
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
  const onChangeUpdateStateMaterialRollPrintingSize = useCallback(
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
  const initialStateMaterialRollPrintingWeights = (item: any) => {
    let temp = [...item?.materialRollPrintingSizes];
    let final: any = [];
    temp.map((materialRollPrinting) => {
      final[materialRollPrinting?.id] = {
        ...materialRollPrinting,
      };
    });

    setUpdateState(final);
  };

  const getMaterialRollPrinting = useCallback(async () => {
    await getAndSetGetAllMaterialRollPrinting(
      callApi,
      setAllMaterialRollPrinting
    );
  }, []);
  const onCloseAddNewMaterialRollPrintingModal = () => {
    setOpenAddNewMaterialRollPrintingModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewMaterialRollPrintingModal(true);
  };
  const onCloseUpdateModal = async () => {
    getMaterialRollPrinting();
    setOpenUpdateMaterialRollPrintingModal(false);
    setIsAddNewMaterialRollPrintingWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateMaterialRollPrintingWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateMaterialRollPrintingModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedMaterialRollPrintingWeight(item);
  };

  const addNewMaterialRollPrintingsSize = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/material-roll-printing/add-material-roll-printing`,
      {
        categoryName,
        materialRollPrintingSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getMaterialRollPrinting();
      onCloseAddNewMaterialRollPrintingModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewMaterialRollPrintingSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/material-roll-printing/add-material-roll-printing-size?categoryName=${selectedItem?.categoryName}`,
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
        getMaterialRollPrinting();
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
  const deleteMaterialRollPrintingSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/material-roll-printing/delete-material-roll-printing-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getMaterialRollPrinting();
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

  const updateMaterialRollPrintingSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/material-roll-printing/update-material-roll-printing-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
  useEffect(() => {
    getMaterialRollPrinting();
  }, []);
  return {
    headerTable,
    allAllMaterialRollPrinting,
    openAddNewMaterialRollPrintingModal,
    items,
    categoryName,
    openUpdateMaterialRollPrintingModal,
    selectedEditItem,
    isAddNewMaterialRollPrintingWights,
    openDeleteModal,
    selectedMaterialRollPrintingWeight,
    updateState,
    onChangeUpdateStateMaterialRollPrintingSize,
    onCloseAddNewMaterialRollPrintingModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewMaterialRollPrintingsSize,
    setOpenUpdateMaterialRollPrintingModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewMaterialRollPrintingWights,
    addNewMaterialRollPrintingSizeByCategoryName,
    deleteMaterialRollPrintingSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMaterialRollPrintingSize,
  };
};

export { useMaterialRollPrinting };
