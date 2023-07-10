import { useCallback, useEffect, useState } from "react";
import { getAndSetAllPlatsSizes } from "@/services/hooks";
import { useGomakeAxios, useSnackBar, useSupplier } from "@/hooks";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import {
  getMaterialsCategories,
  getMaterialsSuppliers,
} from "@/services/hooks/material-data";
import { materialsDataCheckAllState } from "./store/material-check-all";
import { materialsDataState } from "./store/material-store";

const useMaterialData = ({ materialData }: any) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { suppliers, getSupplier } = useSupplier();

  const [materialsStore, setMaterialsStore] =
    useRecoilState<any>(materialsDataState);
  const [materialsCheckStore, setMaterialsCheckStore] = useRecoilState(
    materialsDataCheckAllState
  );

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<any>("");
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [allWeightsGrouped, setAllWeightsGrouped] = useState([]);
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

  const handleCheckboxChange = (sizeId, isChecked) => {
    if (isChecked) {
      setSelectedItems((prevSelectedItems) => [
        ...prevSelectedItems,
        { sizeId },
      ]);
    } else {
      setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.filter((item) => !(item.sizeId === sizeId))
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
    const res = await callApi("POST", `/v1/plats/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: materialsStore.selectedSupplier,
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
      getSheetAllWeights(selectedMaterials, materialsStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [
    data,
    selectedItems,
    actionType,
    materialsStore.selectedSupplier,
    setData,
  ]);
  useEffect(() => {}, [materialsStore]);
  const updateToActive = async () => {
    const res = await callApi("POST", `/v1/plats/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: materialsStore.selectedSupplier,
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
      getSheetAllWeights(selectedMaterials, materialsStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  };
  const updateToInActive = useCallback(async () => {
    const res = await callApi("POST", `/v1/plats/size-id-settngs`, {
      categoryName: selectedMaterials?.key,
      supplierId: materialsStore.selectedSupplier,
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
      getSheetAllWeights(selectedMaterials, materialsStore.selectedSupplier);
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, [
    data,
    selectedItems,
    actionType,
    materialsStore.selectedSupplier,
    setData,
  ]);
  const getSheetSuppliers = useCallback(
    async (categoryName) => {
      let _data = await getMaterialsSuppliers(
        callApi,
        () => {},
        materialData?.getMaterialsSuppliersURL,
        {
          categoryName: categoryName?.key,
        }
      );
      _data.push({
        name: "Add new",
        code: "Add new",
      });
      setMaterialsStore((prev) => {
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
    [materialsStore, materialData]
  );

  const getSheetAllWeights = useCallback(
    async (categoryName: any, supplierId) => {
      await getAndSetAllPlatsSizes(callApi, setAllWeightsGrouped, {
        categoryName: categoryName?.key,
        supplierId: supplierId || "",
      });
    },
    [categoryName]
  );
  const getCategory = useCallback(async () => {
    const data = await getMaterialsCategories(
      callApi,
      setSheetCategories,
      materialData?.getMaterialsCategoriesURL
    );
    // console.log("datadatadata", data);
    if (!categoryName) {
      setCategoryName(data[0]);
    }
  }, [categoryName, materialData]);
  // const getCategory = useCallback(async () => {
  //   const data = await getAndSetPlatsCategores(callApi, setSheetCategories);
  //   if (!categoryName) {
  //     setCategoryName(data[0]);
  //   }
  // }, [categoryName]);

  const onClickAddNewSupplier = () => {
    setShowSupplierModal(true);
  };

  const onClickAddSupplier = async () => {
    await callApi("POST", materialData?.onClickAddSupplierURL, {
      categoryName: selectedMaterials?.key,
      supplierId: materialsStore.selectedSupplier,
    });
    setShowSupplierModal(false);
    getSheetAllWeights(selectedMaterials, materialsStore.selectedSupplier);
    getSheetSuppliers(selectedMaterials);
  };

  const onChangeSupplierToDefault = async (option, value) => {
    if (value) {
      await callApi("POST", materialData?.onChangeSupplierToDefaultURL, {
        categoryName: selectedMaterials?.key,
        supplierId: option.value,
      });
      getSheetSuppliers(selectedMaterials);
    }
  };
  const onChangeSelectedSupplier = async (value) => {
    setMaterialsStore((prev) => {
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
      const defaultItem = materialsStore?.suppliers?.find(
        (item) => item.isDefault
      );
      if (defaultItem) {
        setMaterialsStore((prev) => {
          return {
            ...prev,
            selectedSupplier: defaultItem?.value,
          };
        });

        setIsUpdated(true);
      }
    }
  }, [materialsStore.suppliers]);

  useEffect(() => {
    getCategory();
  }, [materialData?.getMaterialsCategoriesURL]);

  useEffect(() => {
    if (sheetCategories.length) {
      setSelectedMaterials(sheetCategories[0]);
      getSheetSuppliers(sheetCategories[0]);
    }
  }, [sheetCategories]);

  useEffect(() => {
    getSheetAllWeights(selectedMaterials, materialsStore.selectedSupplier);
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
    selectedSupplier: materialsStore.selectedSupplier,
    materialsStore,
    suppliers,
    showSupplierModal,
    modalTitle,
    selectedItems,
    isUpdatePricePerTon,
    isUpdateCurrency,
    open,
    anchorEl,
    materialsCheckStore,
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
    handleCheckboxChange,
    updatePricePetTon,
    onCloseUpdatePricePerTon,
    onCloseUpdateCurrency,
    setMaterialsCheckStore,
    onChangeSelectedSupplier,
  };
};

export { useMaterialData };
