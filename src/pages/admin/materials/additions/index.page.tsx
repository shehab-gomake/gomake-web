import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

import { Table } from "@/widgets/table/table";
import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { materialAdditionsState } from "./store/additions";
import { HeaderFilter } from "./header-filter";
import { useApplications } from "./use-additions";

export default function Additions() {
  const { t } = useTranslation();
  const setMaterialHardboardsState = useSetRecoilState<any>(
    materialAdditionsState
  );
  const {
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdatalApplicationModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    onClickOpenHardboardSizeThicknessWidget,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewAddition,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteAddition,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
  } = useApplications();

  useEffect(() => {
    setMaterialHardboardsState({
      headerTable,
      allAdditions,
      openAddApplicationsModal,
      items,
      categoryName,
      openUpdatalApplicationModal,
      selectedEditItem,
      openDeleteModal,
      selectedAddition,
      updateState,
      onClickOpenHardboardSizeThicknessWidget,
      onChangeUpdateStateAddition,
      onCloseModalAdded,
      onOpnModalAdded,
      changeItems,
      setItems,
      setCategoryName,
      addNewAddition,
      setOpenUpdatalApplicationModal,
      onCloseUpdateModal,
      onOpnUpdateModal,
      deleteAddition,
      setOpenDeleteModal,
      onCloseDeleteModal,
      onOpenDeleteModal,
      updateAddition,
    });
  }, [
    headerTable,
    allAdditions,
    openAddApplicationsModal,
    items,
    categoryName,
    openUpdatalApplicationModal,
    selectedEditItem,
    openDeleteModal,
    selectedAddition,
    updateState,
    onClickOpenHardboardSizeThicknessWidget,
    onChangeUpdateStateAddition,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewAddition,
    setOpenUpdatalApplicationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    deleteAddition,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateAddition,
  ]);
  return (
    <AdminAuthLayout>
      <HeaderTitle title={t("materials.additions.admin.subTitle")} />
      <HeaderFilter />
      <Table tableHeaders={headerTable} tableRows={allAdditions} />
    </AdminAuthLayout>
  );
}
