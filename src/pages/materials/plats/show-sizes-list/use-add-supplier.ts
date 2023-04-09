import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { supplierCurrencies, supplierLists } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAddSupplier = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const suppliers = useRecoilValue(supplierLists);
  const suppliersCurrencies = useRecoilValue(supplierCurrencies);
  const [state, setState] = useState<any>({});

  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.selectSupplier"),
      t("materials.sheetPaper.unitPrice"),
      t("materials.sheetPaper.currency"),
      t("materials.sheetPaper.default"),
      t("materials.sheetPaper.controls"),
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
  const addNewSupplierLamination = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("POST", `/v1/plats/add-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        supplierId: state.supplierId?.value,
        price: parseInt(state?.priceUnit),
        currency: state?.currency?.value,
        isDefault: state?.isDefault || true,
        width: item?.width,
        height: item?.height,
      });
      if (res?.success) {
        let temp = [...data];
        temp.push({
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          supplierId: state.supplierId?.value,
          price: parseInt(state?.priceUnit),
          currency: state?.currency?.value,
          isDefault: state?.isDefault || true,
          width: item?.width,
          height: item?.height,
        });
        setData(temp);

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
  const deleteSupplierLamination = useCallback(
    async (item: any, data: any, setData: any) => {
      const res = await callApi("POST", `/v1/plats/delete-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        supplierId: item.supplierId,
        price: item?.priceUnit,
        currency: item?.currency,
        isDefault: item?.isDefault,
        width: item?.width,
        height: item?.height,
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
  const updateSupplierLamination = useCallback(
    async (item: any) => {
      const res = await callApi("POST", `/v1/plats/update-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        thicknessId: item?.thicknessId,
        supplierId: item.supplierId,
        price: state[`priceUnit-${item?.supplierId}`] || item?.price,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        thickness: item?.thickness,
        isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
      });
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
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
    addNewSupplierLamination,
    deleteSupplierLamination,
    updateSupplierLamination,
  };
};

export { useAddSupplier };
