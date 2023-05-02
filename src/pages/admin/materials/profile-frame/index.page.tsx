import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialProfileFrameState } from "./store/profile-frame";
import { HeaderFilter } from "./header-filter";
import { useProfileFrames } from "./use-profile-frame";

export default function ProfileFrames() {
  const { t } = useTranslation();
  const setMaterialProfileFrameState = useSetRecoilState<any>(
    materialProfileFrameState
  );
  const {
    headerTable,
    allProfileFrame,
    openAddNewProfileFrameModal,
    items,
    categoryName,
    openUpdateProfileFrameModal,
    selectedEditItem,
    isAddNewProfileFrameWights,
    openDeleteModal,
    selectedProfileFrameWeight,
    updateState,
    onChangeUpdateStateProfileFrameSize,
    onCloseAddNewProfileFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewProfileFrameSize,
    setOpenUpdateProfileFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewProfileFrameWights,
    addNewProfileFrameSizeByCategoryName,
    deleteProfileFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateProfileFrameSize,
  } = useProfileFrames();

  useEffect(() => {
    setMaterialProfileFrameState({
      headerTable,
      allProfileFrame,
      openAddNewProfileFrameModal,
      items,
      categoryName,
      openUpdateProfileFrameModal,
      selectedEditItem,
      isAddNewProfileFrameWights,
      openDeleteModal,
      selectedProfileFrameWeight,
      updateState,
      onChangeUpdateStateProfileFrameSize,
      onCloseAddNewProfileFrameModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewProfileFrameSize,
      setOpenUpdateProfileFrameModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewProfileFrameWights,
      addNewProfileFrameSizeByCategoryName,
      deleteProfileFrameSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateProfileFrameSize,
    });
  }, [
    headerTable,
    headerTable,
    allProfileFrame,
    openAddNewProfileFrameModal,
    items,
    categoryName,
    openUpdateProfileFrameModal,
    selectedEditItem,
    isAddNewProfileFrameWights,
    openDeleteModal,
    selectedProfileFrameWeight,
    updateState,
    onChangeUpdateStateProfileFrameSize,
    onCloseAddNewProfileFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewProfileFrameSize,
    setOpenUpdateProfileFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewProfileFrameWights,
    addNewProfileFrameSizeByCategoryName,
    deleteProfileFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateProfileFrameSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.profileFrames.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allProfileFrame} />
    </AdminAuthLayout>
  );
}
