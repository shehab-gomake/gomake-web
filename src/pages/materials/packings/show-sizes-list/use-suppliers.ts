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

  const headerTable = useMemo(
    () => [
      t("materials.packings.selectSupplier"),
      t("materials.packings.pricePerUnit"),
      t("materials.packings.currency"),
      t("materials.packings.default"),
      t("materials.packings.controls"),
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
      const res = await callApi("POST", `/v1/packings/add-supplier`, {
        supplierId: state.supplierId?.value,
        categoryName: item?.categoryName,
        volumeId: item?.volumeId,
        pricePerUnit: parseInt(state?.pricePerUnit),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        length: state?.length,
        height: state?.height,
        width: state?.width,
        weight: state?.weight,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.packingSuppliers);
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
      const res = await callApi("POST", `/v1/packings/delete-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        volumeId: item?.volumeId,
        pricePerUnit: item.pricePerUnit,
        currency: item?.currency,
        isDefault: item?.isDefault,
        length: item?.length,
        height: item?.height,
        width: item?.width,
        weight: item?.weight,
      });
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
      const res = await callApi("POST", `/v1/packings/update-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        volumeId: item?.volumeId,
        pricePerUnit:
          state[`pricePerUnit-${item?.supplierId}`] || item?.pricePerUnit,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
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
        setNewSupplier(_item.packingSuppliers);
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
  return {
    state,
    suppliers,
    suppliersCurrencies,
    headerTable,
    onChangeState,
    onChangePrimaryState,
    addNewSupplier,
    deleteSupplier,
    updateSupplier,
  };
};

export { useNewSupplier };
