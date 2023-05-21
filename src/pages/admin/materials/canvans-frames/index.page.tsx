import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialCanvasFramesState } from "./store/canvas-frames";
import { HeaderFilter } from "./header-filter";
import { useCanvasFrames } from "./use-canvas-frames";

export default function CanvasFrames() {
  const { t } = useTranslation();
  const setMaterialPlatsState = useSetRecoilState<any>(
    materialCanvasFramesState
  );
  const {
    headerTable,
    allCanvasFrames,
    openAddNewPCanvasFrameModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewCanvasFrameWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewCanvasFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewCanvasFrameSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewCanvasFrameWights,
    addNewCanvasFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  } = useCanvasFrames();

  useEffect(() => {
    setMaterialPlatsState({
      headerTable,
      allCanvasFrames,
      openAddNewPCanvasFrameModal,
      items,
      categoryName,
      openUpdatePlatModal,
      selectedEditItem,
      isAddNewCanvasFrameWights,
      openDeleteModal,
      selectedPlatWeight,
      updateState,
      onChangeUpdateStatePlatSize,
      onCloseAddNewCanvasFrameModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewCanvasFrameSize,
      setOpenUpdatePlatModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewCanvasFrameWights,
      addNewCanvasFrameSizeByCategoryName,
      deleteFrameSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateFrameSize,
    });
  }, [
    headerTable,
    allCanvasFrames,
    openAddNewPCanvasFrameModal,
    items,
    categoryName,
    openUpdatePlatModal,
    selectedEditItem,
    isAddNewCanvasFrameWights,
    openDeleteModal,
    selectedPlatWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewCanvasFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewCanvasFrameSize,
    setOpenUpdatePlatModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewCanvasFrameWights,
    addNewCanvasFrameSizeByCategoryName,
    deleteFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFrameSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.canvasFrames.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allCanvasFrames} />
    </AdminAuthLayout>
  );
}
