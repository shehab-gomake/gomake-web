import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllSheetEncapsulation } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useSheetEncapsulation = () => {
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
    openAddNewSheetEncapsulationModal,
    setOpenAddNewSheetEncapsulationModal,
  ] = useState(false);
  const [
    openUpdateSheetEncapsulationModal,
    setOpenUpdateSheetEncapsulationModal,
  ] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allSheetEncapsulation, setAllSheetEncapsulation] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [
    isAddNewSheetEncapsulationWights,
    setIsAddNewSheetEncapsulationWights,
  ] = useState(false);
  const [
    selectedSheetEncapsulationWeight,
    setSelectedSheetEncapsulationWeight,
  ] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      thickness: "",
      weight: "",
      width: "",
      height: "",
      name: "",
      quantityInPackage: "",
      defaultPricePerUnit: "",
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
  const onChangeUpdateStateSheetEncapsulationSize = useCallback(
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
  const initialStateSheetEncapsulationWeights = (item: any) => {
    let temp = [...item?.sheetEncapsulationSizes];
    let final: any = [];
    temp.map((sheetEncapsulationSize) => {
      final[sheetEncapsulationSize?.id] = {
        ...sheetEncapsulationSize,
      };
    });

    setUpdateState(final);
  };

  const getSheetEncapsulation = useCallback(async () => {
    await getAndSetGetAllSheetEncapsulation(callApi, setAllSheetEncapsulation);
  }, []);
  const onCloseAddNewSheetEncapsulationModal = () => {
    setOpenAddNewSheetEncapsulationModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewSheetEncapsulationModal(true);
  };
  const onCloseUpdateModal = async () => {
    getSheetEncapsulation();
    setOpenUpdateSheetEncapsulationModal(false);
    setIsAddNewSheetEncapsulationWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateSheetEncapsulationWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateSheetEncapsulationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedSheetEncapsulationWeight(item);
  };

  const addNewSheetEncapsulationSize = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/sheet-encapsulation/add-sheet-encapsulation`,
      {
        categoryName,
        sheetEncapsulationSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getSheetEncapsulation();
      onCloseAddNewSheetEncapsulationModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewSheetEncapsulationSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet-encapsulation/add-sheet-encapsulation-size?categoryName=${selectedItem?.categoryName}`,
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
        getSheetEncapsulation();
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
  const deleteSheetEncapsulationSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet-encapsulation/delete-sheet-encapsulation-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getSheetEncapsulation();
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

  const updateSheetEncapsulationSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/sheet-encapsulation/update-sheet-encapsulation-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getSheetEncapsulation();
  }, []);
  return {
    headerTable,
    allSheetEncapsulation,
    openAddNewSheetEncapsulationModal,
    items,
    categoryName,
    openUpdateSheetEncapsulationModal,
    selectedEditItem,
    isAddNewSheetEncapsulationWights,
    openDeleteModal,
    selectedSheetEncapsulationWeight,
    updateState,
    onChangeUpdateStateSheetEncapsulationSize,
    onCloseAddNewSheetEncapsulationModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSheetEncapsulationSize,
    setOpenUpdateSheetEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetEncapsulationWights,
    addNewSheetEncapsulationSizeByCategoryName,
    deleteSheetEncapsulationSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateSheetEncapsulationSize,
  };
};

export { useSheetEncapsulation };
