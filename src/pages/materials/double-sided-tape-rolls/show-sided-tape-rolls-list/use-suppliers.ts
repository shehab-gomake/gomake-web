import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { supplierCurrencies, supplierLists } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useNewSupplier = ({ item }: any) => {
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
      t("materials.doubleSidedTapeRolls.selectSupplier"),
      t("materials.doubleSidedTapeRolls.pricePerUnit"),
      t("materials.doubleSidedTapeRolls.width"),
      t("materials.doubleSidedTapeRolls.height"),
      t("materials.doubleSidedTapeRolls.currency"),
      t("materials.doubleSidedTapeRolls.default"),
      t("materials.doubleSidedTapeRolls.controls"),
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

  const addNewSupplier = useCallback(
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi(
        "POST",
        `/v1/double-sided-tape-roll/add-supplier`,
        {
          supplierId: state.supplierId?.value,
          pricePerUnit: parseFloat(state?.pricePerUnit),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
          doubleSidedTapeRollCode: item?.code,
          doubleSidedTapeRollName: item?.name,
          width: 0,
          height: 0,
          weightPerSquareMeter: item?.weightPerSquareMeter,
          isEmptyRow: false,
        }
      );
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.doubleSidedTapeRollSuppliers);
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
  const deleteSupplier = useCallback(
    async (item: any, setData: any, data: any) => {
      const res = await callApi(
        "POST",
        `/v1/double-sided-tape-roll/delete-supplier`,
        {
          supplierId: item.supplierId,
          pricePerUnit: item?.pricePerUnit,
          currency: item?.currency,
          isDefault: item?.isDefault,
          doubleSidedTapeRollCode: item?.doubleSidedTapeRollCode,
          doubleSidedTapeRollName: item?.doubleSidedTapeRollName,
          width: item?.width,
          height: item?.height,
          weightPerSquareMeter: item?.weightPerSquareMeter,
        }
      );
      if (res?.success) {
        const temp = [...data];
        temp.splice(
          temp.findIndex((x) => x.supplierId === item.supplierId),
          1
        );
        setData(temp);
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

  const updateSupplier = useCallback(
    async (item: any, setNewSupplier: any, selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/double-sided-tape-roll/update-supplier`,
        {
          supplierId: item.supplierId,
          doubleSidedTapeRollCode: item.doubleSidedTapeRollCode,
          pricePerUnit:
            state[`pricePerUnit-${item?.supplierId}`] || item?.pricePerUnit,
          currency:
            state[`currency-${item?.supplierId}`]?.value || item?.currency,
          isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
        }
      );
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
        setNewSupplier(_item.doubleSidedTapeRollSuppliers);
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
    addNewSupplier,
    deleteSupplier,
    updateSupplier,
  };
};

export { useNewSupplier };
