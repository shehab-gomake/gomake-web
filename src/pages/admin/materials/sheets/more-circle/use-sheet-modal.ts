import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getAndSetSheetSizes } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { ShowSupplierList } from "@/store";

const useSheetModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [sheetSizes, setSheetSizes] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.code"),
      t("materials.sheetPaper.growingUp"),
      t("materials.sheetPaper.pricePerUnit"),
      t("materials.sheetPaper.pricePerTon"),
      t("materials.sheetPaper.direction"),
      t("materials.sheetPaper.stock"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const OnClickGetSheetSizes = useCallback(async () => {
    const data = await getAndSetSheetSizes(callApi, setSheetSizes, {
      categoryName: item?.categoryName,
      weightId: item?.weightId,
      supplierId: item?.supplierId,
    });
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getSheetSizes = useCallback(async (item: any) => {
    const data = await getAndSetSheetSizes(callApi, undefined, {
      categoryName: item?.categoryName,
      weightId: item?.weightId,
      supplierId: item?.supplierId,
    });

    return data;
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
    setShowUnderRowWidget({
      stateShow: false,
      widget: "",
      item: "",
      key: "",
    });
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const deleteSheetByCategoryName = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/sheet/delete-sheet`, {
      categoryName: item?.categoryName,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      onCloseDeleteModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, []);
  return {
    sheetSizes,
    categoryName,
    headerTable,
    openModal,
    openDeleteModal,
    OnClickGetSheetSizes,
    setOpenModal,
    onCloseModal,
    getSheetSizes,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetByCategoryName,
    t,
  };
};

export { useSheetModal };
