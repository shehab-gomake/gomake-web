import { useGomakeAxios, useSnackBar } from "@/hooks";
import { t } from "i18next";
import { useCallback } from "react";

const UpdateRole  = () => {
    const { callApi } = useGomakeAxios();
    const {setSnackbarStateValue } = useSnackBar();
    const UpdateRole = useCallback(async (data : any) => {
        const res = await callApi("PUT", `/v1/crm-service/roles/update-role`, {
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
        UpdateRole         
      };
};

export {UpdateRole}

