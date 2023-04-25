import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { supplierCurrencies, supplierLists } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAddSupplier = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const suppliers = useRecoilValue(supplierLists);
  const suppliersCurrencies = useRecoilValue(supplierCurrencies);
  const [state, setState] = useState<any>({});
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const headerTable = useMemo(
    () => [
      t("materials.additions.selectSupplier"),
      t("materials.additions.unitPrice"),
      t("materials.additions.currency"),
      t("materials.additions.default"),
      t("materials.additions.controls"),
    ],
    []
  );
  const onChangePrimaryState = (key: any, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };
  const onChangeState = (key: any, supplierId: string, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [`${key}-${supplierId}`]: value,
      };
    });
  };
  const addNewSupplierAdditions = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("POST", `/v1/additions/add-supplier`, {
        supplierId: state.supplierId?.value,
        price: parseInt(state?.priceUnit),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        additionCode: item?.code,
        additionName: item?.name,
        weight: item?.weight,
        adaptationField: item?.adaptationField,
        code: item?.code,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data.find((elem: any) => elem.code === item.code);
        setData(_item.additionSuppliers);
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [state]
  );

  const deleteSupplierAdditions = useCallback(
    async (item: any, setAdditionsData: any, additionsData: any) => {
      const res = await callApi("POST", `/v1/additions/delete-supplier`, {
        supplierId: item.supplierId,
        price: item?.price,
        currency: item?.currency,
        isDefault: item?.isDefault,
        additionCode: item?.additionCode,
        additionName: item?.additionName,
        weight: item?.weight,
        adaptationField: item?.adaptationField,
        code: item?.code,
      });
      if (res?.success) {
        const temp = [...additionsData];
        temp.splice(
          temp.findIndex((x) => x.supplierId === item.supplierId),
          1
        );
        setAdditionsData(temp);
        setSnackbarStateValue({
          state: true,
          message: t("modal.deleteSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.deletefailed"),
          type: "error",
        });
      }
    },
    [state]
  );

  const updateSupplierAdditions = useCallback(
    async (item: any, setAdditionsData: any, selectedItem: any) => {
      const res = await callApi("POST", `/v1/additions/update-supplier`, {
        supplierId: item.supplierId,
        price: state[`priceUnit-${item?.supplierId}`] || item?.price,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
        additionCode: item?.additionCode,
        additionName: item?.additionName,
        weight: item?.weight,
        code: item?.code,
        adaptationField: item?.adaptationField,
      });
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data.find(
          (elem: any) => elem.code === selectedItem.code
        );

        setAdditionsData(_item.additionSuppliers);
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedfailed"),
          type: "error",
        });
      }
    },
    [state]
  );
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onOpenDeleteModal = (item: any) => {
    setOpenDeleteModal(true);
    setSelectedItem(item);
  };
  return {
    state,
    suppliers,
    suppliersCurrencies,
    headerTable,
    openDeleteModal,
    selectedItem,
    onCloseDeleteModal,
    onOpenDeleteModal,
    onChangeState,
    onChangePrimaryState,
    addNewSupplierAdditions,
    deleteSupplierAdditions,
    updateSupplierAdditions,
  };
};

export { useAddSupplier };
