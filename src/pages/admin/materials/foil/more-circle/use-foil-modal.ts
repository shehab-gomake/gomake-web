import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";

const useFoilModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const { setSnackbarStateValue } = useSnackBar();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const deleteFoilByCategoryName = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/foil/delete-foil`, {
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
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteFoilByCategoryName,
    t,
  };
};

export { useFoilModal };
