import {useGomakeAxios, useSnackBar} from "@/hooks";
import {updatePermissionApi} from "@/services/api-service/users/permissions";

const useEditPermissionRolesRelationShip = () => {
    const {callApi} = useGomakeAxios();
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();

    const editPermissionRole = async (data: { permissionId: string, roleId: string }) => {
        const callBackFunction = (res) => {
            if (res?.success) {
                alertSuccessUpdate();
            }else {
                alertFaultUpdate();
            }
        }
        return await updatePermissionApi(callApi, callBackFunction, data)
    }

    return {
        editPermissionRole,
    };
};

export {useEditPermissionRolesRelationShip};