import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialFoilState } from "./store/foil";
import { HeaderFilter } from "./header-filter";
import { useFoil } from "./use-foil";

export default function Foil() {
  const { t } = useTranslation();
  const setMaterialFoilState = useSetRecoilState<any>(materialFoilState);
  const {
    headerTable,
    allFoil,
    openAddNewFoilModal,
    items,
    categoryName,
    openUpdateFoilModal,
    selectedEditItem,
    isAddNewFoilWights,
    openDeleteModal,
    selectedFoilWeight,
    updateState,
    onChangeUpdateStateFoilSize,
    onCloseAddNewFoilModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFoilSize,
    setOpenUpdateFoilModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFoilWights,
    addNewFoilSizeByCategoryName,
    deleteFoilSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFoilSize,
  } = useFoil();

  useEffect(() => {
    setMaterialFoilState({
      headerTable,
      allFoil,
      openAddNewFoilModal,
      items,
      categoryName,
      openUpdateFoilModal,
      selectedEditItem,
      isAddNewFoilWights,
      openDeleteModal,
      selectedFoilWeight,
      updateState,
      onChangeUpdateStateFoilSize,
      onCloseAddNewFoilModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewFoilSize,
      setOpenUpdateFoilModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewFoilWights,
      addNewFoilSizeByCategoryName,
      deleteFoilSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateFoilSize,
    });
  }, [
    headerTable,
    allFoil,
    openAddNewFoilModal,
    items,
    categoryName,
    openUpdateFoilModal,
    selectedEditItem,
    isAddNewFoilWights,
    openDeleteModal,
    selectedFoilWeight,
    updateState,
    onChangeUpdateStateFoilSize,
    onCloseAddNewFoilModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFoilSize,
    setOpenUpdateFoilModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFoilWights,
    addNewFoilSizeByCategoryName,
    deleteFoilSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFoilSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.foils.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allFoil} />
    </AdminAuthLayout>
  );
}
