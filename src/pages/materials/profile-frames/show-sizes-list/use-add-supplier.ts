import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

import { supplierCurrencies, supplierLists } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAddSupplier = ({ item }: any) => {
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
      t("materials.profileFrames.modal.selectSupplier"),
      t("materials.profileFrames.modal.pricePerUnit"),
      t("materials.profileFrames.modal.pricePerMeter"),
      t("materials.profileFrames.modal.currency"),
      t("materials.profileFrames.modal.default"),
      t("materials.profileFrames.modal.controls"),
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

  const addNewSupplierProfileFrame = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("POST", `/v1/profile-frames/add-supplier`, {
        categoryName: item?.categoryName,
        currency: state?.currency?.value,
        width: item?.width,
        height: item?.height,
        isEmptyRow: true,
        length: 0,
        pricePerMeter: parseInt(state?.pricePerMeter),
        pricePerUnit: parseInt(state?.pricePerUnit),
        sizeId: item?.sizeId,
        supplierId: state.supplierId?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data?.find((elem: any) => elem.code === item.code);

        setData(_item.profileFrameSuppliers);
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

  const deleteSupplierProfileFrame = useCallback(
    async (item: any, data: any, setData: any) => {
      const res = await callApi("POST", `/v1/profile-frames/delete-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        pricePerMeter: state?.pricePerMeter,
        pricePerUnit: state?.pricePerUnit,
        currency: item?.currency,
        isDefault: item?.isDefault,
        width: item?.width,
        height: item?.height,
        length: item?.length,
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

  const updateSupplierProfileFrame = useCallback(
    async (item: any, setData: any, selectedItem: any) => {
      const res = await callApi("POST", `/v1/profile-frames/update-supplier`, {
        supplierId: item.supplierId,
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,

        pricePerMeter:
          state[`pricePerMeter-${item?.supplierId}`] || item?.pricePerMeter,
        pricePerUnit:
          state[`pricePerUnit-${item?.supplierId}`] || item?.pricePerUnit,
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
        const _item: any = data?.find(
          (elem: any) => elem.code === selectedItem.code
        );

        setData(_item.profileFrameSuppliers);
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
    addNewSupplierProfileFrame,
    deleteSupplierProfileFrame,
    updateSupplierProfileFrame,
  };
};

export { useAddSupplier };
