import { Permissions } from "@/components/CheckPermission/enum";

export interface IAuthLayout {
  children: any;
  permissionEnumValue ?: Permissions;
}
