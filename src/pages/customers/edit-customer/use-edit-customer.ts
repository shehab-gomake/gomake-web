import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useEditCustomer = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const { setSnackbarStateValue } = useSnackBar();

  const editCustomer = useCallback(
    async (data: any, setData: any) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await callApi("PUT", `/v1/customers/update-customer`, {
            customer: data,
          });
          if (res?.success) {
            setSnackbarStateValue({
              state: true,
              message: t("modal.updatedSusuccessfully"),
              type: "success",
            });
            resolve(true); 
          } else {
            setSnackbarStateValue({
              state: true,
              message: t("modal.updatedfailed"),
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
    editCustomer,
  };
};

export { useEditCustomer };