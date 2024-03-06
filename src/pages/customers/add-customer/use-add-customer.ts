import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useAddCustomer = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const { setSnackbarStateValue } = useSnackBar();

  const addNewCustomer = useCallback(
    async (data: any) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await callApi("POST", `/v1/customers/add-customer`, data);
          if (res?.success) {
            setSnackbarStateValue({
              state: true,
              message: t("modal.addedSusuccessfully"),
              type: "success",
            });
            resolve(res.data.data.data);
          } else {
            setSnackbarStateValue({
              state: true,
              message: t("modal.addedfailed"),
              type: "error",
            });
            reject("API call failed");
          }
        } catch (error) {
          console.error("Error editing customer:", error);
          reject(error);
        }
      });
    },
    [state]
  );

  return {
    state,
    addNewCustomer,
  };
};

export { useAddCustomer };
