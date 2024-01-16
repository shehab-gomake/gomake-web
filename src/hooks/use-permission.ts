import { Permissions } from "@/components/CheckPermission/enum";
import { permissionsState } from "@/store/permissions";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const useUserPermission = ()=>{

    const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
   
    const CheckPermission =  (permission : string) => {
        const res = permissions.includes(permission);
        //return true;
        return !!(permissions && res);
    }
    return {
        CheckPermission,
      };
  
};
export { useUserPermission }