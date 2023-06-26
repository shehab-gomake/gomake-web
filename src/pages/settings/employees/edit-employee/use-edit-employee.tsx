import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useEditEmployee = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { setSnackbarStateValue } = useSnackBar();


  const editEmployee = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("PUT", `/v1/employee/update-employee`, {
        employee: data,
      });
      if (res?.success) {

        setSnackbarStateValue({
          state: true,
          message: t("employees.successfullyUpdated"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("employees.updatedfailed"),
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
  };

  return {
    state,
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    editEmployee,
  };
};

export { useEditEmployee };