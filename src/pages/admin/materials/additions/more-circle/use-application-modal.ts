import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";

const useApplicationModal = ({ item }: any) => {
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

  const deleteAdditionByCode = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/delete-addition`, {
      code: item?.code,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deleteSusuccessfully"),
        type: "sucess",
      });
      onCloseDeleteModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.deletefailed"),
        type: "error",
      });
    }
  }, []);
  return {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteAdditionByCode,
    t,
  };
};

export { useApplicationModal };
