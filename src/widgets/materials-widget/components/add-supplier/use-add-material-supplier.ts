import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { addMaterialSupplier } from "@/services/api-service/materials/materials-suppliers-endpoints";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  flagState,
  materialCategorySuppliersState,
  openAddSupplierModalState,
  selectedSupplierIdState,
} from "@/widgets/materials-widget/state";
import { EMaterialActiveFilter } from "../../enums";

const useAddMaterialSupplier = () => {
  const { callApi } = useGomakeAxios();
  const { query } = useRouter();
  const { materialType, materialCategory } = query;
  const [newSupplier, setNewSupplier] = useState<{
    id?: string;
    label: string;
    value: string;
    isDefault: boolean;
    name?: string;
  } | null>(null);
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState(openAddSupplierModalState);
  const setSelectedSupplier = useSetRecoilState(selectedSupplierIdState);
  const [materialSuppliers, setMaterialSuppliers] = useRecoilState(
    materialCategorySuppliersState
  );

  const setActiveFilter = useSetRecoilState(activeFilterState);
  const setFlagState = useSetRecoilState(flagState);

  const onSelectSupplier = (e, value) => {
    setNewSupplier(value);
  };

  const onAddSupplier = async (materialCategories) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        setOpenModal(false);
        setNewSupplier(null);
        setMaterialSuppliers([...materialSuppliers, newSupplier]);
        setSelectedSupplier(newSupplier.id);
        setActiveFilter(EMaterialActiveFilter.ALL);
        materialCategories.find(
          (category) => category.categoryKey === materialCategory
        )?.isAddedByPrintHouse
          ? setFlagState(true)
          : setFlagState(false);
      } else {
        alertFaultAdded();
      }
    };
    if (newSupplier) {
      await addMaterialSupplier(callApi, callBack, {
        materialTypeKey: materialType?.toString(),
        categoryKey: materialCategory?.toString(),
        supplierId: newSupplier?.id,
      });
    }
  };

  // Supplier card
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [supplier, setSupplier] = useState<any>([]);

  const onSupplierAdd = (supplier) => {
    const newSupplierOption = {
      label: supplier?.name,
      value: supplier?.id,
      isDefault: true,
    };

    setNewSupplier(newSupplierOption);
    onSelectSupplier(null, newSupplierOption);
    setOpenSupplierModal(false);
  };

  const onClickAddSupplier = () => {
    setOpenSupplierModal(true);
  };

  const onCloseSupplierModal = () => {
    setOpenSupplierModal(false);
  };

  return {
    onSelectSupplier,
    onAddSupplier,
    openModal,
    setOpenModal,
    supplier,
    setSupplier,
    openSupplierModal,
    setOpenSupplierModal,
    setNewSupplier,
    newSupplier,
    onSupplierAdd,
    onClickAddSupplier,
    onCloseSupplierModal,
  };
};

export { useAddMaterialSupplier };
