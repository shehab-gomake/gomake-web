import { useCallback, useEffect, useState } from "react";
import {
  getAndSetAllMegantsData,
  getAndSetAllmegantCodes,
  getAndSetMagnetsSuppliers,
} from "@/services/hooks";
import { useGomakeAxios, useSnackBar, useSupplier } from "@/hooks";
import { useRecoilState } from "recoil";
import { sheetState } from "./store/sheet";
import { useTranslation } from "react-i18next";
import { sheetCheckAllState } from "./store/sheet-check-all";

const useTubes = () => {
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
  const [selectedItems, setSelectedItems] = useState({});
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
  const onOpenUpdatePrice = () => {
    setModalTitle(t("materials.sheetPaper.updatePrice"));
    setIsUpdatePricePerTon(true);
    setActionType(6);
    handleClose();
  };
  const onOpenAddPercentToPrice = () => {
    setModalTitle(t("materials.sheetPaper.addPercentToPrice"));
    setIsUpdatePricePerTon(true);
    setActionType(2);
    handleClose();
  };

  useEffect(() => {
    setSelectedItems({ data });
  }, [data]);
  const updatePricePetTon = useCallback(async () => {
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
      categoryName: selectedMaterials.code,
      supplierId: sheetStore.selectedSupplier,
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
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
      categoryName: selectedMaterials.code,
      supplierId: sheetStore.selectedSupplier,
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
    const res = await callApi("POST", `/v1/magnets/size-id-settngs`, {
      categoryName: selectedMaterials.code,
      supplierId: sheetStore.selectedSupplier,
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
      let _data = await getAndSetMagnetsSuppliers(callApi, () => {}, {
        categoryName: categoryName.code,
      });
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
      await getAndSetAllMegantsData(callApi, setAllWeightsGrouped, {
        categoryName: categoryName.code,
        supplierId: supplierId || "",
      });
    },
    [categoryName]
  );
  const getCategory = useCallback(async () => {
    const data = await getAndSetAllmegantCodes(callApi, setSheetCategories);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName]);

  const onClickAddNewSupplier = () => {
    setShowSupplierModal(true);
  };

  const onClickAddSupplier = async () => {
    await callApi("POST", `/v1/magnets/add-supplier-catogry`, {
      categoryName: selectedMaterials.code,
      supplierId: sheetStore.selectedSupplier,
    });
    setShowSupplierModal(false);
    getSheetAllWeights(selectedMaterials, sheetStore.selectedSupplier);
    getSheetSuppliers(selectedMaterials);
  };

  const onChangeSupplierToDefault = async (option, value) => {
    if (value) {
      await callApi("POST", `/v1/magnets/update-default-supplier`, {
        categoryName: selectedMaterials.code,
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
    onOpenUpdatePrice,
    onOpenAddPercentToPrice,
    updatePricePetTon,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    setSheetCheckStore,
    onChangeSelectedSupplier,
  };
};

export { useTubes };
