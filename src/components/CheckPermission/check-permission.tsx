import { useRecoilState } from 'recoil';
import { Permissions } from './enum';
import { permissionsState } from '@/store/permissions';

interface PermissionCheckProps {
  userPermission: string;
  children: any;
  
}

const PermissionCheck: React.FC<PermissionCheckProps> = ({ userPermission, children }) => {
  //const [permissions, setPermissions] = useRecoilState(permissionsState);
  return children;
  /*if(permissions){
    const res = permissions.includes(userPermission);
    if (res) {
      return children;
    } else {
      return null;
    }
  }*/
  
};

export { PermissionCheck };