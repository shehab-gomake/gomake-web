import { useRecoilState } from 'recoil';
import { Permissions } from './enum';
import { permissionsState } from '@/store/permissions';

interface PermissionCheckProps {
  userPermission: string;
  children: any;
  
}

const PermissionCheck: React.FC<PermissionCheckProps> = ({ userPermission, children }) => {
  const [permissions, setPermissions] = useRecoilState(permissionsState);

 
  if(permissions){
    if (permissions[userPermission]) {
      return children;
    } else {
      return null;
    }
  }
  
};

export { PermissionCheck };