import { Permissions} from './enum';
interface PermissionCheckProps {
    userPermission: string;
    children:any;
}

  function hasPermissions(userPermission: string): userPermission is Permissions {
    return Object.values(Permissions).includes(userPermission as Permissions);
  }
  
const PermissionCheck: React.FC<PermissionCheckProps> = ({ userPermission, children }) => {

    const hasPermission = hasPermissions(userPermission);
    return hasPermission ? children : null;
}
export  { PermissionCheck};