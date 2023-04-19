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
      t("materials.foils.selectSupplier"),
      t("materials.foils.pricePerRoll"),
      t("materials.foils.pricePerSquareMeter"),
      t("materials.foils.currency"),
      t("materials.foils.default"),
      t("materials.foils.controls"),
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
      const res = await callApi("POST", `/v1/foils/add-supplier`, {
        supplierId: state.supplierId?.value,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        pricePerSquareMeter: parseInt(state?.pricePerSquareMeter),
        pricePerRoll: parseInt(state?.pricePerRoll),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        weightPerSquareMeter: item?.weightPerSquareMeter,
        width: item?.width,
        height: item?.height,
        thickness: item?.thickness || 0,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.foilSuppliers);
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
      const res = await callApi("POST", `/v1/foils/delete-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        pricePerSquareMeter: item.pricePerSquareMeter,
        pricePerRoll: item.pricePerRoll,
        currency: item?.currency,
        isDefault: item?.isDefault,
        width: item?.width,
        height: item?.height,
        weightPerSquareMeter: item?.weightPerSquareMeter,
        thickness: item?.thickness || 0,
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
      const res = await callApi("POST", `/v1/foils/update-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        pricePerSquareMeter:
          state[`pricePerSquareMeter-${item?.supplierId}`] ||
          item?.pricePerSquareMeter,
        pricePerRoll:
          state[`pricePerRoll-${item?.supplierId}`] || item?.pricePerRoll,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
        color: item?.color,
        width: item?.width,
        height: item?.height,
        weightPerSquareMeter: item?.weightPerSquareMeter,
        thickness: item?.thickness,
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
        setNewSupplier(_item.foilSuppliers);
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
