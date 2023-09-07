import { useGomakeAxios, useSnackBar } from "@/hooks";
import { t } from "i18next";
import { useCallback } from "react";

const AddRole  = () => {
    const { callApi } = useGomakeAxios();
    const {setSnackbarStateValue } = useSnackBar();
    const addNewRole = useCallback(async (data : any) => {
        alert(data)
        const res = await callApi("POST", `/v1/crm-service/roles/add-roles`, {
          data,
        });
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
      }, []);

      return {
        addNewRole         
      };
};

export {AddRole}

