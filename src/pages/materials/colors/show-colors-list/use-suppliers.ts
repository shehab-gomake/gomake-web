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
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const headerTable = useMemo(
    () => [
      t("materials.colors.selectSupplier"),
      t("materials.colors.pricePerLiter"),
      t("materials.colors.volumeInLiters"),
      t("materials.colors.literInSquareMeter"),
      t("materials.colors.pricePerContainer"),
      t("materials.colors.currency"),
      t("materials.colors.default"),
      t("materials.colors.controls"),
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

  const addNewSupplier = useCallback(
    async (supplierData: any, setNewSupplier: any) => {
      const res = await callApi("POST", `/v1/colors/add-supplier`, {
        supplierId: state.supplierId?.value,
        pricePerLiter: parseFloat(state?.pricePerLiter),
        pricePerContainer: parseFloat(state?.pricePerContainer),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
        colorCode: item?.code,
        colorName: item?.colorName,
        volumeInLiters: 0,
        literInSquareMeter: 0,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setNewSupplier(_item?.colorSuppliers);
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
      const res = await callApi("POST", `/v1/colors/delete-supplier`, {
        supplierId: item.supplierId,
        pricePerLiter: item?.pricePerLiter,
        pricePerContainer: item?.pricePerContainer,
        pricePerUnit: item.pricePerUnit,
        currency: item?.currency,
        isDefault: item?.isDefault,
        colorCode: item?.colorCode,
        colorName: item?.colorName,
        volumeInLiters: item?.volumeInLiters,
        literInSquareMeter: item?.literInSquareMeter,
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
      const res = await callApi("POST", `/v1/colors/update-supplier`, {
        supplierId: item.supplierId,
        colorCode: item.colorCode,
        pricePerLiter:
          state[`pricePerLiter-${item?.supplierId}`] || item?.pricePerLiter,
        pricePerContainer:
          state[`pricePerContainer-${item?.supplierId}`] ||
          item?.pricePerContainer,
        volumeInLiters:
          state[`volumeInLiters-${item?.supplierId}`] || item?.volumeInLiters,
        literInSquareMeter:
          state[`literInSquareMeter-${item?.supplierId}`] ||
          item?.literInSquareMeter,
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
        setNewSupplier(_item.colorSuppliers);
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
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onOpenDeleteModal = (item: any) => {
    setOpenDeleteModal(true);
    setSelectedItem(item);
  };
  return {
    state,
    suppliers,
    suppliersCurrencies,
    headerTable,
    openDeleteModal,
    selectedItem,
    onCloseDeleteModal,
    onOpenDeleteModal,
    onChangeState,
    onChangePrimaryState,
    addNewSupplier,
    deleteSupplier,
    updateSupplier,
  };
};

export { useNewSupplier };
