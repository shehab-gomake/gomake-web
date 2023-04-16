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
      t("materials.sheetEncapsulation.selectSupplier"),
      t("materials.sheetEncapsulation.pricePerUnit"),
      t("materials.sheetEncapsulation.height"),
      t("materials.sheetEncapsulation.width"),
      t("materials.sheetEncapsulation.weight"),
      t("materials.sheetEncapsulation.thickness"),
      t("materials.sheetEncapsulation.currency"),
      t("materials.sheetEncapsulation.default"),
      t("materials.sheetEncapsulation.controls"),
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
  console.log("state", state);
  const addNewSupplier = useCallback(
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi(
        "POST",
        `/v1/sheet-encapsulation/add-supplier`,
        {
          supplierId: state.supplierId?.value,
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          pricePerUnit: parseInt(state?.pricePerUnit),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
          thickness: state?.thickness,
          height: state?.height,
          width: state?.width,
          weight: state?.weight,
        }
      );
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.sheetEncapsulationSuppliers);
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
        `/v1/sheet-encapsulation/delete-supplier`,
        {
          supplierId: item.supplierId,
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          pricePerUnit: item.pricePerUnit,
          currency: item?.currency,
          isDefault: item?.isDefault,
          thickness: item?.thickness,
          height: item?.height,
          width: item?.width,
          weight: item?.weight,
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
        `/v1/sheet-encapsulation/update-supplier`,
        {
          supplierId: item.supplierId,
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          pricePerUnit:
            state[`pricePerUnit-${item?.supplierId}`] || item?.pricePerUnit,
          thickness: state[`thickness-${item?.supplierId}`] || item?.thickness,
          height: state[`height-${item?.supplierId}`] || item?.height,
          width: state[`width-${item?.supplierId}`] || item?.width,
          weight: state[`weight-${item?.supplierId}`] || item?.weight,
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
        setNewSupplier(_item.sheetEncapsulationSuppliers);
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
