import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialEnvelopeState } from "./store/plat";
import { HeaderFilter } from "./header-filter";
import { useAllEnvelops } from "./use-envelope";

export default function Sheets() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(materialEnvelopeState);
  const {
    headerTable,
    allEnvelops,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  } = useAllEnvelops();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allEnvelops,
      openAddNewPlatModal,
      items,
      categoryName,
      openUpdateSheetModal,
      selectedEditItem,
      isAddNewSheetWights,
      openDeleteModal,
      selectedSheetWeight,
      updateState,
      onChangeUpdateStatePlatSize,
      onCloseAddNewPlatModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewPlatsSize,
      setOpenUpdateSheetModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewSheetWights,
      addNewPlatSizeByCategoryName,
      deletePlatSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updatePlatSize,
    });
  }, [
    headerTable,
    allEnvelops,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.envelops.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allEnvelops} />
    </AdminAuthLayout>
  );
}
