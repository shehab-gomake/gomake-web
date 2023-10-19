import { useRecoilState } from 'recoil';
import { Permissions } from './enum';
import { permissionsState } from '@/store/permissions';

interface PermissionCheckProps {
  userPermission: string;
  children: any;
  
}

function hasPermissions(userPermission: string): userPermission is Permissions {
  return Object.values(Permissions).includes(userPermission as Permissions);
}

const PermissionCheck: React.FC<PermissionCheckProps> = ({ userPermission, children }) => {
  const [permissions, setPermissions] = useRecoilState(permissionsState);

  const hasPermission = hasPermissions(userPermission);
  if(permissions){
    if (hasPermission && permissions[userPermission]) {
      return children;
    } else {
      return null;
    }
  }
  
};

export { PermissionCheck };