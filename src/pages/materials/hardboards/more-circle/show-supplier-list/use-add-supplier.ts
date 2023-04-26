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
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const headerTable = useMemo(
    () => [
      t("materials.hardboards.supplierModal.selectSupplier"),
      t("materials.hardboards.supplierModal.pricePerSquareMeter"),
      t("materials.hardboards.supplierModal.currency"),
      t("materials.hardboards.supplierModal.default"),
      t("materials.hardboards.supplierModal.controls"),
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

  const addNewSupplierSheet = useCallback(
    async (suppliersData: any, setSuppliersData: any) => {
      const res = await callApi("POST", `/v1/hardboards/add-supplier`, {
        categoryName: item?.categoryName,
        thicknessId: item?.thicknessId,
        sizeId: item?.sizeId,
        supplierId: state.supplierId?.value,
        pricePerSquareMeter: parseInt(state?.pricePerSquareMeter),
        currency: state?.currency?.value,
        isDefault:
          typeof state?.isDefault == "boolean" ? state?.isDefault : true,
      });
      if (res?.success) {
        const data: any = await refetchMaterialData.refetch();
        const _item: any = data.find((elem: any) => elem.code === item.code);

        setSuppliersData(_item.hardboardSuppliers);

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
      const res = await callApi("POST", `/v1/hardboards/delete-supplier`, {
        categoryName: item?.categoryName,
        thicknessId: item?.thicknessId,
        sizeId: item?.sizeId,
        supplierId: item.supplierId,
        pricePerSquareMeter: item?.pricePerSquareMeter,
        currency: item?.currency,
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
      const res = await callApi("POST", `/v1/hardboards/update-supplier`, {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        thicknessId: item?.thicknessId,
        supplierId: item.supplierId,
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

        setSuppliersData(_item.hardboardSuppliers);
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
    sheetDirection,
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
    addNewSupplierSheet,
    deleteSupplierSheet,
    updateSupplierSheet,
  };
};

export { useAddSupplier };
