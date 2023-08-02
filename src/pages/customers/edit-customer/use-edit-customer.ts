import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useEditCustomer = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { setSnackbarStateValue } = useSnackBar();

  const editCustomer = useCallback(
    async (data: any, setData: any) => {
      console.log(data);
      const res = await callApi("PUT", `/v1/customers/update-customer`, {
        customer: data , 
      });
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.updatedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.Updated failed"),
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
    editCustomer,
  };
};

export { useEditCustomer };