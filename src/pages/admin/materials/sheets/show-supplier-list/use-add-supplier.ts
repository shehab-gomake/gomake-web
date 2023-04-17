import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { supplierCurrencies, supplierLists } from "@/store";
import { getAndSetSheetDirection } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const useAddSupplier = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const suppliers = useRecoilValue(supplierLists);
  const suppliersCurrencies = useRecoilValue(supplierCurrencies);
  const [sheetDirection, setSheetDirection] = useState([]);
  const [state, setState] = useState<any>({});

  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.selectSupplier"),
      t("materials.sheetPaper.unitPrice"),
      t("materials.sheetPaper.pricePerTon"),
      t("materials.sheetPaper.currency"),
      t("materials.sheetPaper.direction"),
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
  const getSheetDirections = useCallback(async () => {
    await getAndSetSheetDirection(callApi, setSheetDirection);
  }, []);

  useEffect(() => {
    getSheetDirections();
  }, []);
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);

  const addNewSupplierSheet = useCallback(
    async (suppliersData: any, setSuppliersData: any) => {
      const res = await callApi("POST", `/v1/sheets/add-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        weightId: item?.weightId,
        supplierId: state.supplierId?.value,
        pricePerUnit: parseInt(state?.pricePerUnit),
        pricePerTon: parseInt(state?.pricePerTon),
        currency: state?.currency?.value,
        direction: parseInt(state?.direction?.value),
        thickness: 0,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data.find((elem: any) => elem.code === item.code);
        setSuppliersData(_item.sheetSuppliers);

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
      const res = await callApi("POST", `/v1/sheets/delete-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        weightId: item?.weightId,
        supplierId: item.supplierId,
        pricePerUnit: item?.pricePerUnit,
        pricePerTon: item?.pricePerTon,
        currency: item?.currency,
        direction: item?.direction,
        thickness: item?.thickness,
        isDefault: item?.isDefault,
      });
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
    async (item: any, setSuppliersData: any, selectedItem: any) => {
      const res = await callApi("POST", `/v1/sheets/update-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        weightId: item?.weightId,
        supplierId: item.supplierId,
        pricePerUnit:
          state[`pricePerUnit-${item?.supplierId}`] || item?.pricePerUnit,
        pricePerTon:
          state[`pricePerTon-${item?.supplierId}`] || item?.pricePerTon,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        direction:
          state[`direction-${item?.supplierId}`]?.value || item?.direction,
        thickness: 0,
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
        setSuppliersData(_item.sheetSuppliers);
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
    sheetDirection,
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
