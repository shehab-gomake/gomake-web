import { useCallback, useEffect, useState } from "react";
import {
  getAndSetAllSheetWeights,
  getAndSetSheetCategory,
  getAndSetSheetSuppliers,
} from "@/services/hooks";
import { useGomakeAxios, useSnackBar, useSupplier } from "@/hooks";
import { useRecoilState } from "recoil";
import { sheetState } from "./store/sheet";
import { useTranslation } from "react-i18next";
import { sheetCheckAllState } from "./store/sheet-check-all";

const useSheetPaper = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { suppliers, getSupplier } = useSupplier();
  const [sheetStore, setSheetStore] = useRecoilState(sheetState);
  const [sheetCheckStore, setSheetCheckStore] =
    useRecoilState(sheetCheckAllState);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<any>("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>("");
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allWeightsGrouped, setAllWeightsGrouped] = useState([]);

  const [actionType, setActionType] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isUpdatePricePerTon, setIsUpdatePricePerTon] = useState(false);
  const [isUpdateCurrency, setIsUpdateCurrency] = useState(false);
  const [data, setData] = useState();

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
  const onOpenUpdatePricePerTon = () => {
    setIsUpdatePricePerTon(true);
    setActionType(0);
    handleClose();
  };
  const onOpenUpdateUnitPrice = () => {
    setIsUpdatePricePerTon(true);
    setActionType(1);
    handleClose();
  };
  const onOpenAddPercentToPrice = () => {
    setIsUpdatePricePerTon(true);
    setActionType(2);
    handleClose();
  };

  const handleCheckboxChange = (weightId, sizeId, isChecked) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { weightId, sizeId },
      ]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter(
          (item) => !(item.weightId === weightId && item.sizeId === sizeId)
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
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: actionType,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      onCloseUpdatePricePerTon();
      onCloseUpdateCurrency();
      getSheetAllWeights(selectedMaterials);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const updateToActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: 3,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
      getSheetAllWeights(selectedMaterials);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const updateToInActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/sheets/size-id-settngs`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
      actionType: 4,
      data: selectedItems,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
      handleClose();
      getSheetAllWeights(selectedMaterials);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [data, selectedItems, actionType, setData]);
  const getSheetSuppliers = useCallback(
    async (categoryName = false) => {
      let _data = await getAndSetSheetSuppliers(callApi, () => {}, {
        categoryName,
      });
      _data.push({
        name: "Add new",
        code: "Add new",
      });
      setSheetStore({
        ...sheetState,
        suppliers: _data.map((item) => ({
          label: item.name,
          value: item.id,
          isDefault: item.isDefault,
        })),
      });
    },
    [sheetStore]
  );

  const getSheetAllWeights = useCallback(
    async (categoryName: string) => {
      await getAndSetAllSheetWeights(callApi, setAllWeightsGrouped, {
        categoryName,
        supplierId: supplierId || "",
      });
    },
    [categoryName, supplierId]
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetSheetCategory(callApi, setSheetCategories);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName, supplierId]);

  const onClickAddNewSupplier = () => {
    setShowSupplierModal(true);
  };

  const onClickAddSupplier = async () => {
    await callApi("POST", `/v1/sheets/add-supplier-catogry`, {
      categoryName: selectedMaterials,
      supplierId: selectedSupplier,
    });
    setShowSupplierModal(false);
    getSheetAllWeights(selectedMaterials);
    getSheetSuppliers(selectedMaterials);
  };

  const onChangeSupplierToDefault = async (option, value) => {
    if (value) {
      await callApi("POST", `/v1/sheets/update-default-supplier`, {
        categoryName: selectedMaterials,
        supplierId: option.value,
      });
      getSheetSuppliers(selectedMaterials);
    }
  };
  useEffect(() => {
    const defaultItem = sheetStore?.suppliers?.find((item) => item.isDefault);
    setSelectedSupplier(defaultItem?.value);
  }, [sheetStore]);

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
    getSheetAllWeights(selectedMaterials);
    getSheetSuppliers(selectedMaterials);
  }, [selectedMaterials]);

  useEffect(() => {
    getSupplier();
  }, [allWeightsGrouped]);

  return {
    sheetCategories,
    categoryName,
    allWeightsGrouped,
    selectedMaterials,
    selectedSupplier,
    sheetStore,
    suppliers,
    showSupplierModal,
    setSelectedMaterials,
    setSelectedSupplier,
    getSheetAllWeights,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,

    selectedItems,
    isUpdatePricePerTon,
    isUpdateCurrency,
    setData,
    open,
    handleClick,
    onOpenUpdateCurrency,
    anchorEl,
    handleClose,
    updateToInActive,
    updateToActive,
    onOpenUpdatePricePerTon,
    onOpenUpdateUnitPrice,
    onOpenAddPercentToPrice,
    handleCheckboxChange,
    updatePricePetTon,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    sheetCheckStore,
    setSheetCheckStore,
  };
};

export { useSheetPaper };
