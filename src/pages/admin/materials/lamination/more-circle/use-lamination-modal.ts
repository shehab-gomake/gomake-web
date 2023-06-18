import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";

const useLaminationModal = ({ item }: any) => {
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

  const deleteLaminationByCategoryName = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/lamination/delete-lamination`,
      {
        categoryName: item?.categoryName,
      }
    );
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
    deleteLaminationByCategoryName,
    t,
  };
};

export { useLaminationModal };
