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
      "Select a Supplier",
      "Unit price",
      "Price per ton",
      "Currency",
      "Direction",
      "Default",
    ],
    []
  );
  console.log("State", state);
  const onChangeState = (key: any, value: any) => {
    setState((prevState: any) => {
      return {
        ...prevState,
        [key]: value,
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

  return {
    sheetDirection,
    state,
    suppliers,
    suppliersCurrencies,
    headerTable,
    onChangeState,
    addNewSupplierSheet,
  };
};

export { useAddSupplier };
