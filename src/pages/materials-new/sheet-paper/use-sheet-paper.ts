import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAndSetAllSheetWeights,
  getAndSetSheetCategory,
  getAndSetSheetSuppliers,
  getAndSetSheetWeights,
} from "@/services/hooks";
import { useGomakeAxios, useSupplier } from "@/hooks";
import { useRecoilState } from "recoil";
import { sheetState } from "./store/sheet";

const useSheetPaper = () => {
  const tableHeaders = [
    "c",
    "Weight",
    "Size",
    "Thickness",
    "cost ($) per unit/ton",
    "Directions",
    "Active",
    "Currency",
    "Stock",
    // "Delete",
  ];
  const tableWidth = [
    "5%",
    "10%",
    "10%",
    "10%",
    "25%",
    "10%",
    "10%",
    "10%",
    "10%",
    // "5%",
  ];
  const { suppliers, getSupplier } = useSupplier();
  const [sheetStore, setSheetStore] = useRecoilState(sheetState);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

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

  const [selectedMaterials, setSelectedMaterials] = useState<any>("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>("");

  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [sheetCategories, setSheetCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(undefined);
  const [supplierId, setSupplierId] = useState(undefined);
  const [allWeightsGrouped, setAllWeightsGrouped] = useState([]);

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
    tableHeaders,
    tableWidth,
    setSelectedMaterials,
    setSelectedSupplier,
    getSheetAllWeights,
    onClickAddNewSupplier,
    setShowSupplierModal,
    onClickAddSupplier,
    onChangeSupplierToDefault,
  };
};

export { useSheetPaper };
