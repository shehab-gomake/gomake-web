import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialTubeState } from "./store/tube";
import { HeaderFilter } from "./header-filter";
import { useTube } from "./use-tube";

export default function Tube() {
  const { t } = useTranslation();
  const setMaterialTubeState = useSetRecoilState<any>(materialTubeState);
  const {
    headerTable,
    allTube,
    openAddNewTubeModal,
    items,
    categoryName,
    openUpdateTubeModal,
    selectedEditItem,
    isAddNewTubeWights,
    openDeleteModal,
    selectedTubeWeight,
    updateState,
    onChangeUpdateStateTubeSize,
    onCloseAddNewTubeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewTubeSize,
    setOpenUpdateTubeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewTubeWights,
    addNewTubeSizeByCategoryName,
    deleteTubeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateTubeSize,
  } = useTube();

  useEffect(() => {
    setMaterialTubeState({
      headerTable,
      allTube,
      openAddNewTubeModal,
      items,
      categoryName,
      openUpdateTubeModal,
      selectedEditItem,
      isAddNewTubeWights,
      openDeleteModal,
      selectedTubeWeight,
      updateState,
      onChangeUpdateStateTubeSize,
      onCloseAddNewTubeModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewTubeSize,
      setOpenUpdateTubeModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewTubeWights,
      addNewTubeSizeByCategoryName,
      deleteTubeSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateTubeSize,
    });
  }, [
    headerTable,
    headerTable,
    allTube,
    openAddNewTubeModal,
    items,
    categoryName,
    openUpdateTubeModal,
    selectedEditItem,
    isAddNewTubeWights,
    openDeleteModal,
    selectedTubeWeight,
    updateState,
    onChangeUpdateStateTubeSize,
    onCloseAddNewTubeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewTubeSize,
    setOpenUpdateTubeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewTubeWights,
    addNewTubeSizeByCategoryName,
    deleteTubeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateTubeSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.tubes.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allTube} />
    </AdminAuthLayout>
  );
}
