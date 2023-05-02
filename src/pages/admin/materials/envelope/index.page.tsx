import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialEnvelopeState } from "./store/envelope";
import { HeaderFilter } from "./header-filter";
import { useAllEnvelops } from "./use-envelope";

export default function Envelopes() {
  const { t } = useTranslation();
  const setMaterialEnvelopeState = useSetRecoilState<any>(
    materialEnvelopeState
  );
  const {
    headerTable,
    allEnvelops,
    openAddNewEnvelopeModal,
    items,
    categoryName,
    openUpdateEnvelopeModal,
    selectedEditItem,
    isAddNewEnvelopeWights,
    openDeleteModal,
    selectedEnvelopeWeight,
    updateState,
    onChangeUpdateStateEnvelopeSize,
    onCloseAddNewEnvelopeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewEnvelopesSize,
    setOpenUpdateEnvelopeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewEnvelopeWights,
    addNewEnvelopeSizeByCategoryName,
    deleteEnvelopeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateEnvelopeSize,
  } = useAllEnvelops();

  useEffect(() => {
    setMaterialEnvelopeState({
      headerTable,
      allEnvelops,
      openAddNewEnvelopeModal,
      items,
      categoryName,
      openUpdateEnvelopeModal,
      selectedEditItem,
      isAddNewEnvelopeWights,
      openDeleteModal,
      selectedEnvelopeWeight,
      updateState,
      onChangeUpdateStateEnvelopeSize,
      onCloseAddNewEnvelopeModal,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewEnvelopesSize,
      setOpenUpdateEnvelopeModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setIsAddNewEnvelopeWights,
      addNewEnvelopeSizeByCategoryName,
      deleteEnvelopeSize,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateEnvelopeSize,
    });
  }, [
    headerTable,
    allEnvelops,
    openAddNewEnvelopeModal,
    items,
    categoryName,
    openUpdateEnvelopeModal,
    selectedEditItem,
    isAddNewEnvelopeWights,
    openDeleteModal,
    selectedEnvelopeWeight,
    updateState,
    onChangeUpdateStateEnvelopeSize,
    onCloseAddNewEnvelopeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewEnvelopesSize,
    setOpenUpdateEnvelopeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewEnvelopeWights,
    addNewEnvelopeSizeByCategoryName,
    deleteEnvelopeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateEnvelopeSize,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.envelops.admin.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allEnvelops} />
    </AdminAuthLayout>
  );
}
