import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialMagnetState } from "./store/magnets";
import { HeaderFilter } from "./header-filter";
import { useDoubleSidedTapeRoll } from "./use-magnet";

export default function Additions() {
  const { t } = useTranslation();
  const setMaterialHardboardsState =
    useSetRecoilState<any>(materialMagnetState);
  const {
    headerTable,
    allMagnets,
    openAddMagnetModal,
    items,
    categoryName,
    openUpdateMagnetModal,
    selectedEditItem,
    openDeleteModal,
    selectedMagnet,
    updateState,
    onChangeUpdateStateMagnet,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addMagnet,
    setOpenAddMagnetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteMagnet,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMagnet,
    updateApplicationThicknessSize,
  } = useDoubleSidedTapeRoll();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allMagnets,
      openAddMagnetModal,
      items,
      categoryName,
      openUpdateMagnetModal,
      selectedEditItem,
      openDeleteModal,
      selectedMagnet,
      updateState,
      onChangeUpdateStateMagnet,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addMagnet,
      setOpenAddMagnetModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      deleteMagnet,

      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateMagnet,
      updateApplicationThicknessSize,
    });
  }, [
    headerTable,
    allMagnets,
    openAddMagnetModal,
    items,
    categoryName,
    openUpdateMagnetModal,
    selectedEditItem,
    openDeleteModal,
    selectedMagnet,
    updateState,
    onChangeUpdateStateMagnet,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addMagnet,
    setOpenAddMagnetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteMagnet,

    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateMagnet,
    updateApplicationThicknessSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.magnets.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allMagnets} />
    </AdminAuthLayout>
  );
}
