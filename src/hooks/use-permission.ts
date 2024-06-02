import { Permissions } from "@/components/CheckPermission/enum";
import { permissionsState } from "@/store/permissions";
import { useRecoilValue } from "recoil";

const useUserPermission = ()=>{

    const permissions = useRecoilValue<any>(permissionsState);
   
    const CheckPermission =  (permission : Permissions) => {
        const res = permissions.includes(permission);
        return !!(permissions && res);
    }
    
    return {
        CheckPermission,
      };
  
};
export { useUserPermission }