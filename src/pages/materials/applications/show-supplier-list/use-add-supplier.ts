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
  const [applicationDirection, setAapplicationDirection] = useState([]);
  const [state, setState] = useState<any>({});

  const headerTable = useMemo(
    () => [
      t("materials.applications.selectSupplier"),
      t("materials.applications.pricePerSquareMeter"),
      t("materials.applications.currency"),
      t("materials.applications.default"),
      t("materials.applications.controls"),
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
    await getAndSetSheetDirection(callApi, setAapplicationDirection);
  }, []);

  useEffect(() => {
    getSheetDirections();
  }, []);
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);

  const addNewSupplierSheet = useCallback(
    async (suppliersData: any, setSuppliersData: any) => {
      const res = await callApi("POST", `/v1/applications/add-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        thicknessId: item?.thicknessId,
        supplierId: state.supplierId?.value,
        pricePerSquareMeter: parseInt(state?.pricePerSquareMeter),
        currency: state?.currency?.value,
        thickness: 0,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data.find((elem: any) => elem.code === item.code);

        setSuppliersData(_item.applicationSuppliers);

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
      const res = await callApi("POST", `/v1/applications/delete-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        thicknessId: item?.thicknessId,
        supplierId: item.supplierId,
        pricePerSquareMeter: item?.pricePerSquareMeter,
        currency: item?.currency,
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
      const res = await callApi("POST", `/v1/applications/update-supplier`, {
        categoryName: item?.categoryName,
        thicknessId: item?.thicknessId,
        sizeId: item?.sizeId,
        supplierId: item?.supplierId,
        pricePerSquareMeter:
          state[`pricePerSquareMeter-${item?.supplierId}`] ||
          item?.pricePerSquareMeter,
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
        setSuppliersData(_item.applicationSuppliers);
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
    applicationDirection,
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
