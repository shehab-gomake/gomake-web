import { permissionsState } from "@/store/permissions";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const usePermission = ()=>{

    const [permissions, setPermissions] = useRecoilState<any>(permissionsState);
  
    const CheckPermission =  (permission : string) => {
        if (permissions && permissions[permission]) {
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