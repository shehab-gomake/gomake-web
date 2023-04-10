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
  const addNewSupplierPrintingMaterials = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi(
        "POST",
        `/v1/material-roll-printings/add-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          supplierId: state.supplierId?.value,
          pricePerSquareMeter: parseInt(state?.priceUnit),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
          width: item?.width,
          height: item?.height,
          withPremier: item?.withPremier,
          weightPerSquareMeter: item?.weightPerSquareMeter,
        }
      );
      if (res?.success) {
        let temp = [...data];
        temp.push({
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          supplierId: state.supplierId?.value,
          pricePerSquareMeter: parseInt(state?.priceUnit),
          currency: state?.currency?.value,
          isDefault:
            typeof state?.isDefault == "boolean" ? state?.isDefault : true,
          width: item?.width,
          height: item?.height,
          withPremier: item?.withPremier,
          weightPerSquareMeter: item?.weightPerSquareMeter,
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
  const deleteSupplierPrintingMaterials = useCallback(
    async (item: any, data: any, setData: any) => {
      const res = await callApi(
        "POST",
        `/v1/material-roll-printings/delete-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          supplierId: item.supplierId,
          pricePerSquareMeter: item?.priceUnit,
          currency: item?.currency,
          isDefault: item?.isDefault,
          width: item?.width,
          height: item?.height,
          withPremier: item?.withPremier,
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
  const updateSupplierPrintingMaterials = useCallback(
    async (item: any) => {
      const res = await callApi(
        "POST",
        `/v1/material-roll-printings/update-supplier`,
        {
          categoryName: item?.categoryName,
          sizeId: item?.sizeId,
          supplierId: item.supplierId,
          pricePerSquareMeter:
            state[`pricePerSquareMeter-${item?.supplierId}`] ||
            item?.pricePerSquareMeter,
          currency:
            state[`currency-${item?.supplierId}`]?.value || item?.currency,
          isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
          width: item?.width,
          height: item?.height,
          withPremier: item?.withPremier,
          weightPerSquareMeter: item?.weightPerSquareMeter,
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
    addNewSupplierPrintingMaterials,
    deleteSupplierPrintingMaterials,
    updateSupplierPrintingMaterials,
  };
};

export { useAddSupplier };
