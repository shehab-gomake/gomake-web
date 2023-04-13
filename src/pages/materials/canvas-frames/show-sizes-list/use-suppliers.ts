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
      t("materials.additions.selectSupplier"),
      t("materials.canvasFrames.price"),
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
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi("POST", `/v1/canvas-frames/add-supplier`, {
        supplierId: state.supplierId?.value,
        price: parseInt(state?.price),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        width: item?.width,
        height: item?.height,
        weight: item?.weight,
        thickness: item?.thickness || 0,
        code: item?.code,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        console.log("data", data);
        const _item: any = data?.find((elem: any) => elem.code === item.code);
        console.log("_item", _item);

        setNewSupplier(_item?.canvasFrameSuppliers);
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
      const res = await callApi("POST", `/v1/canvas-frames/delete-supplier`, {
        supplierId: item.supplierId,
        price: item?.priceUnit,
        currency: item?.currency,
        isDefault: item?.isDefault,
        additionCode: item?.code,
        additionName: item?.name,
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
      const res = await callApi("POST", `/v1/canvas-frames/update-supplier`, {
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
  return {
    state,
    suppliers,
    suppliersCurrencies,
    headerTable,
    onChangeState,
    onChangePrimaryState,
    addNewSupplierAdditions,
    deleteSupplierAdditions,
    updateSupplierAdditions,
  };
};

export { useNewSupplier };
