import { documentPermissionMap } from "@/components/CheckPermission/enum";
import { permissionsState } from "@/store/permissions";
import { useRecoilValue } from "recoil";

const useUserPermission = () => {

    const permissions = useRecoilValue<any>(permissionsState);

    const CheckPermission = (permission: string) => {
        const res = permissions.includes(permission);
        return !!(permissions && res);
    }

    const CheckDocumentPermission = (documentType: string, permission: string) => {
        const specificPermissionMap = documentPermissionMap[permission];
        if (!specificPermissionMap) {
            return false; 
        }

        const requiredPermission = specificPermissionMap[documentType];
        return requiredPermission ? CheckPermission(requiredPermission) : true;
    };

    return {
        CheckPermission,
        CheckDocumentPermission
    };

};
export { useUserPermission }