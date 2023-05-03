import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialFrameState } from "./store/frame";
import { HeaderFilter } from "./header-filter";
import { useFrame } from "./use-frame";

export default function Frame() {
  const { t } = useTranslation();
  const setMaterialFrameState = useSetRecoilState<any>(materialFrameState);
  const {
    headerTable,
    allFrame,
    openAddNewFrameModal,
    items,
    categoryName,
    openUpdateFrameModal,
    selectedEditItem,
    isAddNewFrameWights,
    openDeleteModal,
    selectedFrameWeight,
    updateState,
    onChangeUpdateStateFrameSize,
    onCloseAddNewFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFrameSize,
    setOpenUpdateFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFrameWights,
    addNewFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  } = useFrame();

  useEffect(() => {
    setMaterialFrameState({
      headerTable,
      allFrame,
      openAddNewFrameModal,
      items,
      categoryName,
      openUpdateFrameModal,
      selectedEditItem,
      isAddNewFrameWights,
      openDeleteModal,
      selectedFrameWeight,
      updateState,
      onChangeUpdateStateFrameSize,
      onCloseAddNewFrameModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewFrameSize,
      setOpenUpdateFrameModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewFrameWights,
      addNewFrameSizeByCategoryName,
      deleteFrameSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateFrameSize,
    });
  }, [
    headerTable,
    allFrame,
    openAddNewFrameModal,
    items,
    categoryName,
    openUpdateFrameModal,
    selectedEditItem,
    isAddNewFrameWights,
    openDeleteModal,
    selectedFrameWeight,
    updateState,
    onChangeUpdateStateFrameSize,
    onCloseAddNewFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFrameSize,
    setOpenUpdateFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFrameWights,
    addNewFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.frames.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allFrame} />
    </AdminAuthLayout>
  );
}
