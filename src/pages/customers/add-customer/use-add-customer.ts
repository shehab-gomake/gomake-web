import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useCustomers } from "../use-customers";

const useAddCustomer = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const [openAddCustomerModal, setOpenAddCustomerModal] =useState(true);
  const { setSnackbarStateValue } = useSnackBar();

  const addNewCustomer = useCallback(
    async (data: any, setData: any) => {
      const res = await callApi("POST", `/v1/customers/add-customer`, data);
      if (res?.success) {
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
  
  const onCloseModalAdded = () => {
    setOpenAddCustomerModal(false);
  };

  return {
    state,
    addNewCustomer,
  };
};

export { useAddCustomer };