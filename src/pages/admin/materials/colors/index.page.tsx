import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialColorState } from "./store/colors";
import { HeaderFilter } from "./header-filter";
import { useColors } from "./use-colors";

export default function Colors() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(materialColorState);
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
  } = useColors();

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
      <HeaderTitle title={t("tabs.colors")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allMagnets} />
    </AdminAuthLayout>
  );
}
