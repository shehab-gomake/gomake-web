import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useEditPermissionRolesRelationShip = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const [state, setState] = useState<any>({});
  const { setSnackbarStateValue } = useSnackBar();

  const editPrmissionRole = useCallback(
    async (data: any) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await callApi("PUT", `/v1/crm-service/RolesPermissionsRelationships/UpdateRolesPermissionsRelationship`, {
            permissionId: data.permissionId,
            roleId : data.roleId,
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
          console.error("Error editing role permission relation:", error);
          reject(error); 
        }
      });
    },
    [state]
  );
  
  return {
    state,
    editPrmissionRole,
  };
};

export { useEditPermissionRolesRelationShip };