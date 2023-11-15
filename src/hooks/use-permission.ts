import { Permissions } from "@/components/CheckPermission/enum";
import { permissionsState } from "@/store/permissions";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const usePermission = ()=>{

    const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
   
    const CheckPermission =  (permission : string) => {
        const res = permissions.includes(permission);
    
        if (permissions && res) {
            return true;
            } else {
            return false;
            }
    }
    return {
        CheckPermission,
      };
  
};
export { usePermission }