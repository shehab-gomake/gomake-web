import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialPlatsState } from "./store/sheet-encapsulation";
import { HeaderFilter } from "./header-filter";
import { usePlat } from "./use-sheet-encapsulation";

export default function Plat() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(materialPlatsState);
  const {
    headerTable,
    allPlats,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPlatWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPlatWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  } = usePlat();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allPlats,
      openAddNewPlatModal,
      items,
      categoryName,
      openUpdatePlatModal,
      selectedEditItem,
      isAddNewPlatWights,
      openDeleteModal,
      selectedPlatWeight,
      updateState,
      onChangeUpdateStatePlatSize,
      onCloseAddNewPlatModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPlatsSize,
      setOpenUpdatePlatModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewPlatWights,
      addNewPlatSizeByCategoryName,
      deletePlatSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePlatSize,
    });
  }, [
    headerTable,
    allPlats,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewPlatWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPlatWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.sheetEncapsulation.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allPlats} />
    </AdminAuthLayout>
  );
}
