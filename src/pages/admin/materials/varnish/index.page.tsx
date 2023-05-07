import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialVarnishState } from "./store/varnish";
import { HeaderFilter } from "./header-filter";
import { useVarnish } from "./use-varnish";

export default function Additions() {
  const { t } = useTranslation();
  const setMaterialHardboardsState =
    useSetRecoilState<any>(materialVarnishState);
  const {
    headerTable,
    allVarnish,
    openAddVarnishModal,
    items,
    categoryName,
    openUpdateVarnishModal,
    selectedEditItem,
    openDeleteModal,
    selectedVarnish,
    updateState,
    onChangeUpdateStateVarnish,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addVarnish,
    setOpenAddVarnishModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateVarnish,
  } = useVarnish();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allVarnish,
      openAddVarnishModal,
      items,
      categoryName,
      openUpdateVarnishModal,
      selectedEditItem,
      openDeleteModal,
      selectedVarnish,
      updateState,
      onChangeUpdateStateVarnish,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addVarnish,
      setOpenAddVarnishModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateVarnish,
    });
  }, [
    headerTable,
    allVarnish,
    openAddVarnishModal,
    items,
    categoryName,
    openUpdateVarnishModal,
    selectedEditItem,
    openDeleteModal,
    selectedVarnish,
    updateState,
    onChangeUpdateStateVarnish,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addVarnish,
    setOpenAddVarnishModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateVarnish,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.varnishs.title")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allVarnish} />
    </AdminAuthLayout>
  );
}
