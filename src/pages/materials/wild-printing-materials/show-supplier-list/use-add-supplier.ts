import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

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
  const addNewSupplierSheet = useCallback(
    async (suppliersData: any, setSuppliersData: any) => {
      console.log("item", item);
      console.log("state", state);
      const res = await callApi(
        "POST",
        `/v1/wide-format-material/add-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          typeId: item?.typeId,
          supplierId: state.supplierId?.value,
          pricePerMeterSquare: parseInt(state?.pricePerMeterSquare),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        }
      );
      if (res?.success) {
        let temp = [...suppliersData];
        temp.push({
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          typeId: item?.typeId,
          supplierId: state.supplierId?.value,
          pricePerMeterSquare: parseInt(state?.pricePerMeterSquare),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        });
        setSuppliersData(temp);

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
  const deleteSupplierSheet = useCallback(
    async (item: any, suppliersData: any, setSuppliersData: any) => {
      const res = await callApi(
        "POST",
        `/v1/wide-format-material/delete-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          typeId: item?.typeId,
          supplierId: item.supplierId,
          pricePerMeterSquare: item?.pricePerMeterSquare,
          currency: item?.currency,
          isDefault: item?.isDefault,
        }
      );
      if (res?.success) {
        const temp = [...suppliersData];
        temp.splice(
          temp.findIndex((x) => x.supplierId === item.supplierId),
          1
        );
        setSuppliersData(temp);
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
  const updateSupplierSheet = useCallback(
    async (item: any) => {
      const res = await callApi(
        "POST",
        `/v1/wide-format-material/update-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          typeId: item?.typeId,
          supplierId: item.supplierId,
          pricePerMeterSquare:
            state[`pricePerMeterSquare-${item?.supplierId}`] ||
            item?.pricePerMeterSquare,
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
    addNewSupplierSheet,
    deleteSupplierSheet,
    updateSupplierSheet,
  };
};

export { useAddSupplier };
