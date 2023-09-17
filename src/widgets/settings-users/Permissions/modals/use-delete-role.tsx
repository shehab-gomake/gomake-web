import { useGomakeAxios, useSnackBar } from "@/hooks";
import { t } from "i18next";
import { useCallback } from "react";

const DeleteRole  = () => {
    const { callApi } = useGomakeAxios();
    const {setSnackbarStateValue } = useSnackBar();
    const DeleteRole = useCallback(async (data : any) => {
        const res = await callApi("DELETE", `v1/crm-service/roles/delete-role`, {
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
        DeleteRole         
      };
};

export {DeleteRole}

