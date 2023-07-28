import { useCallback, useEffect, useState } from "react";
import {
  getAndSetAllRollEncapsulationsThikness,
  getAndSetEncapsulationRollsCategory,
  getAndSetRollEncapsulationsSuppliers,
} from "@/services/hooks";
import { useGomakeAxios, useSnackBar, useSupplier } from "@/hooks";
import { useRecoilState } from "recoil";
import { sheetState } from "./store/sheet";
import { useTranslation } from "react-i18next";
import { sheetCheckAllState } from "./store/sheet-check-all";

const useRollEncapsulations = () => {
  const [isLoader, setIsLoader] = useState(true);
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { suppliers, getSupplier } = useSupplier();

  const [sheetStore, setSheetStore] = useRecoilState<any>(sheetState);
  const [sheetCheckStore, setSheetCheckStore] =
    useRecoilState(sheetCheckAllState);

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<any>("");
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [allWeightsGrouped, setAllWeightsGrouped] = useState(null);
  const [actionType, setActionType] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isUpdatePricePerTon, setIsUpdatePricePerTon] = useState(false);
  const [isUpdateCurrency, setIsUpdateCurrency] = useState(false);
  const [data, setData] = useState();

  const [modalTitle, setModalTitle] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCloseUpdateCurrency = () => {
    setIsUpdateCurrency(false);
  };
  const onOpenUpdateCurrency = () => {
    setIsUpdateCurrency(true);
    setActionType(5);
    handleClose();
  };
  const onCloseUpdatePricePerTon = () => {
    setIsUpdatePricePerTon(false);
  };
  const onOpenUpdatepricePerSquareMeter = () => {
    setModalTitle(t("materials.sheetPaper.pricePerSquareMeter"));
    setIsUpdatePricePerTon(true);
    setActionType(8);
    handleClose();
  };
  const onOpenAddPercentToPrice = () => {
    setModalTitle(t("materials.sheetPaper.addPercentToPrice"));
    setIsUpdatePricePerTon(true);
    setActionType(2);
    handleClose();
  };

  const handleCheckboxChange = (thicknessId, sizeId, isChecked) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { thicknessId, sizeId },
      ]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter(
          (item) =>
            !(item.thicknessId === thicknessId && item.sizeId === sizeId)
        )
      );
    }
  };
  useEffect(() => {
    const updatedData: any = selectedItems.map((item) => {
      return {
        ...item,
        data,
      };
    });
    setSelectedItems(updatedData);
  }, [data]);
  const updatePricePetTon = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: sheetStore.selectedSupplier,
        actionType: actionType,
        data: selectedItems,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      onCloseUpdatePricePerTon();
      onCloseUpdateCurrency();
      getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, sheetStore.selectedSupplier, setData]);
  useEffect(() => {}, [sheetStore]);
  const updateToActive = async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: sheetStore.selectedSupplier,
        actionType: 3,
        data: selectedItems,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
      getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  };
  const updateToInActive = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/roll-encapsulations/size-id-settngs`,
      {
        categoryName: selectedMaterials?.key,
        supplierId: sheetStore.selectedSupplier,
        actionType: 4,
        data: selectedItems,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
      getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, sheetStore.selectedSupplier, setData]);
  const getSheetSuppliers = useCallback(
    async (categoryName) => {
      let _data = await getAndSetRollEncapsulationsSuppliers(
        callApi,
        () => {},
        {
          categoryName: categoryName?.key,
        }
      );
      _data.push({
        name: "Add new",
        code: "Add new",
      });
      setSheetStore((prev) => {
        return {
          ...prev,
          suppliers: _data.map((item) => ({
            label: item.name,
            value: item.id,
            isDefault: item.isDefault,
          })),
        };
      });
    },
    [sheetStore]
  );

  const getSheetAllWeights = useCallback(
    async (categoryName: any, supplierId) => {
      setIsLoader(true);
      await getAndSetAllRollEncapsulationsThikness(
        callApi,
        setAllWeightsGrouped,
        {
          categoryName: categoryName?.key,
          supplierId: supplierId || "",
        }
      );
    },
    [categoryName]
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetEncapsulationRollsCategory(
      callApi,
      setSheetCategories
    );
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onClickAddNewSupplier = () => {
    setShowSupplierModal(true);
  };

  const onClickAddSupplier = async () => {
    await callApi("POST", `/v1/roll-encapsulations/add-supplier-catogry`, {
      categoryName: selectedMaterials?.key,
      supplierId: sheetStore.selectedSupplier,
    });
    setShowSupplierModal(false);
    getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    getSheetSuppliers(selectedMaterials);
  };

  const onChangeSupplierToDefault = async (option, value) => {
    if (value) {
      await callApi("POST", `/v1/roll-encapsulations/update-default-supplier`, {
        categoryName: selectedMaterials?.key,
        supplierId: option.value,
      });
      getSheetSuppliers(selectedMaterials);
    }
  };
  const onChangeSelectedSupplier = async (value) => {
    setSheetStore((prev) => {
      return {
        ...prev,
        selectedSupplier: value?.value,
      };
    });
    getSheetAllWeights(selectedMaterials, value?.value);
  };
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    if (!isUpdated) {
      const defaultItem = sheetStore?.suppliers?.find((item) => item.isDefault);
      if (defaultItem) {
        setSheetStore((prev) => {
          return {
            ...prev,
            selectedSupplier: defaultItem?.value,
          };
        });

        setIsUpdated(true);
      }
    }
  }, [sheetStore.suppliers]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    if (sheetCategories.length) {
      setSelectedMaterials(sheetCategories[0]);
      getSheetSuppliers(sheetCategories[0]);
    }
  }, [sheetCategories]);

  useEffect(() => {
    getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    getSheetSuppliers(selectedMaterials);
  }, [selectedMaterials]);

  useEffect(() => {
    getSupplier();
  }, [allWeightsGrouped]);

  useEffect(() => {
    if (allWeightsGrouped) {
      setIsLoader(false);
    }
  }, [allWeightsGrouped]);
  return {
    sheetCategories,
    categoryName,
    allWeightsGrouped,
    selectedMaterials,
    selectedSupplier: sheetStore.selectedSupplier,
    sheetStore,
    suppliers,
    showSupplierModal,
    modalTitle,
    selectedItems,
    isUpdatePricePerTon,
    isUpdateCurrency,
    open,
    anchorEl,
    sheetCheckStore,
    isLoader,
    setSelectedMaterials,
    getSheetAllWeights,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,
    setData,
    handleClick,
    onOpenUpdateCurrency,
    handleClose,
    updateToInActive,
    updateToActive,
    onOpenUpdatepricePerSquareMeter,
    onOpenAddPercentToPrice,
    handleCheckboxChange,
    updatePricePetTon,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    setSheetCheckStore,
    onChangeSelectedSupplier,
  };
};

export { useRollEncapsulations };
