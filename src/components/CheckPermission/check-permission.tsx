import { useRecoilValue } from 'recoil';
import { Permissions } from './enum';
import { permissionsState } from '@/store/permissions';

interface PermissionCheckProps {
  userPermission: Permissions;
  children: any;
}

const PermissionCheck: React.FC<PermissionCheckProps> = ({ userPermission, children }) => {
  const permissions = useRecoilValue(permissionsState);
  console.log("userPermission", { userPermission, permissions })

  if (permissions) {
    return permissions.includes(userPermission) ? <>{children}</> : null;
  }
};

export { PermissionCheck };
