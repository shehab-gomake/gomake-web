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
      t("materials.additions.selectSupplier"),
      t("materials.canvasFrames.price"),
      t("materials.additions.currency"),
      t("materials.additions.default"),
      t("materials.additions.controls"),
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
  const addNewSupplierAdditions = useCallback(
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi("POST", `/v1/canvas-frames/add-supplier`, {
        supplierId: state.supplierId?.value,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        price: parseInt(state?.price),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        width: item?.width,
        height: item?.height,
        weight: item?.weight,
        thickness: item?.thickness || 0,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        console.log("data", data);
        const _item: any = data?.find((elem: any) => elem.code === item.code);
        console.log("_item", _item);

        setNewSupplier(_item?.canvasFrameSuppliers);
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

  const deleteSupplierAdditions = useCallback(
    async (item: any, setAdditionsData: any, additionsData: any) => {
      const res = await callApi("POST", `/v1/canvas-frames/delete-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        price: item.price,
        currency: item?.currency,
        isDefault: item?.isDefault,
        width: item?.width,
        height: item?.height,
        weight: item?.weight,
        thickness: item?.thickness,
      });
      if (res?.success) {
        const temp = [...additionsData];
        temp.splice(
          temp.findIndex((x) => x.supplierId === item.supplierId),
          1
        );
        setAdditionsData(temp);
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

  const updateSupplierAdditions = useCallback(
    async (item: any, setNewSupplier: any, selectedItem: any) => {
      console.log("item", item);
      console.log("selectedItem", selectedItem);
      const res = await callApi("POST", `/v1/canvas-frames/update-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        price: state[`price-${item?.supplierId}`] || item?.price,
        currency:
          state[`currency-${item?.supplierId}`]?.value || item?.currency,
        isDefault: state[`isDefault-${item?.supplierId}`] || item?.isDefault,
        width: item?.width,
        height: item?.height,
        weight: item?.weight,
        thickness: item?.thickness || 0,
      });
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
        const data: any = await refetchMaterialData.refetch();
        console.log("dataaaaaa", data);
        const _item: any = data.find(
          (elem: any) => elem.code === selectedItem.code
        );
        console.log("_itemaaaaa", _item);
        setNewSupplier(_item.canvasFrameSuppliers);
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
    addNewSupplierAdditions,
    deleteSupplierAdditions,
    updateSupplierAdditions,
  };
};

export { useNewSupplier };
