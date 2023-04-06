import { useGomakeAxios, useSupplier } from "@/hooks";
import { getAndSetSheetDirection } from "@/services/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const useAddSupplier = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { suppliers, suppliersCurrencies, getSupplier, getSupplierCurrencies } =
    useSupplier();
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
    getSupplier();
    getSupplierCurrencies();
  }, []);

  const addNewSupplierSheet = useCallback(async () => {
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
      isDefault: state?.isDefault || true,
    });
    return res;
  }, [state]);
  const deleteSupplierSheet = useCallback(
    async (item: any) => {
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
    },
    [state]
  );
  const updateSupplierSheet = useCallback(
    async (item: any) => {
      console.log("dddd", item?.supplierId);
      console.log("state", state[`currency-${item?.supplierId}`]?.value);
      const res = await callApi("POST", `/v1/sheets/update-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        weightId: item?.weightId,
        supplierId: item.supplierId,
        pricePerUnit: state[`pricePerUnit-${item?.supplierId}`],
        pricePerTon: state[`pricePerTon-${item?.supplierId}`],
        currency: state[`currency-${item?.supplierId}`]?.value,
        direction: state[`direction-${item?.supplierId}`]?.value,
        thickness: 0,
        isDefault: state[`isDefault-${item?.supplierId}`] || true,
      });
      return res;
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
