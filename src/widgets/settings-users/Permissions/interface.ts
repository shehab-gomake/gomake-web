export interface IPermissionsGroup {
    id: string;
    key: null | string;
    name: string
    isAdminGroup?:boolean;
}

export interface IPermission {
    description: string;
    id: string;
    key: string;
    rolesPermissionsRelationships: IRolesPermissionsRelationships[];
}

export interface IRole {
    id: string;
    name: string;
    key: string;
    isAdminRole?: boolean;
    recordID: string;
}

export interface IRolesPermissionsRelationships {
    id: string;
    permissionId: string;
    roleId: string;
}

export interface IPermissionsResponse {
    groups: IPermissionsGroup[];
    permissions: IPermission[];
    roles: IRole[];
}