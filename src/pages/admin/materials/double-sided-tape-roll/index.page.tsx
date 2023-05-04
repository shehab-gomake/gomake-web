import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialDoublesidedTapeRollState } from "./store/double-sided-tape-roll";
import { HeaderFilter } from "./header-filter";
import { useDoubleSidedTapeRoll } from "./use-double-sided-tape-roll";

export default function Additions() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(
    materialDoublesidedTapeRollState
  );
  const {
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdateDoubleSidedTapeRollModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    addNewApplicationThicknesSizeByCategoryName,
    onChangeUpdateStateDoubleSidedTapeRoll,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addDoubleSidedTapeRoll,
    setOpenUpdateDoubleSidedTapeRollModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteDoubleSidedTapeRoll,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateDoubleSidedTapeRoll,
    updateApplicationThicknessSize,
  } = useDoubleSidedTapeRoll();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allAdditions,
      openAddApplicationsModal,
      items,
      categoryName,
      openUpdateDoubleSidedTapeRollModal,
      selectedEditItem,
      openDeleteModal,
      selectedAddition,
      updateState,
      addNewApplicationThicknesSizeByCategoryName,
      onChangeUpdateStateDoubleSidedTapeRoll,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addDoubleSidedTapeRoll,
      setOpenUpdateDoubleSidedTapeRollModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      deleteDoubleSidedTapeRoll,
      deleteApplicationThicknessSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateDoubleSidedTapeRoll,
      updateApplicationThicknessSize,
    });
  }, [
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdateDoubleSidedTapeRollModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    addNewApplicationThicknesSizeByCategoryName,
    onChangeUpdateStateDoubleSidedTapeRoll,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addDoubleSidedTapeRoll,
    setOpenUpdateDoubleSidedTapeRollModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteDoubleSidedTapeRoll,
    deleteApplicationThicknessSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateDoubleSidedTapeRoll,
    updateApplicationThicknessSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.doubleSidedTapeRolls.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allAdditions} />
    </AdminAuthLayout>
  );
}
