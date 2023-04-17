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
      t("materials.glues.selectSupplier"),
      t("materials.glues.literInSquareMeter"),
      t("materials.glues.volumeInLiters"),
      t("materials.glues.pricePerContainer"),
      t("materials.glues.currency"),
      t("materials.glues.default"),
      t("materials.glues.controls"),
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
  console.log("item", item);

  const addNewSupplier = useCallback(
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi("POST", `/v1/glues/add-supplier`, {
        supplierId: state.supplierId?.value,
        pricePerLiter: item?.pricePerLiter,
        pricePerContainer: parseFloat(state?.pricePerContainer),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        glueCode: item?.code,
        typeName: item?.typeName,
        volumeInLiters: 0,
        literInSquareMeter: 0,
        weightPerLiter: item?.weightPerLiter,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.glueSuppliers);
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
      const res = await callApi("POST", `/v1/glues/delete-supplier`, {
        supplierId: item.supplierId,
        pricePerLiter: item?.pricePerLiter,
        pricePerContainer: item?.pricePerContainer,
        currency: item?.currency,
        isDefault: item?.isDefault,
        glueCode: item?.glueCode,
        typeName: item?.typeName,
        volumeInLiters: item?.volumeInLiters,
        literInSquareMeter: item?.literInSquareMeter,
        weightPerLiter: item?.weightPerLiter,
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
      const res = await callApi("POST", `/v1/glues/update-supplier`, {
        supplierId: item.supplierId,
        glueCode: item.glueCode,
        pricePerLiter:
          state[`pricePerLiter-${item?.supplierId}`] || item?.pricePerLiter,
        pricePerContainer:
          state[`pricePerContainer-${item?.supplierId}`] ||
          item?.pricePerContainer,
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
        setNewSupplier(_item.glueSuppliers);
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
