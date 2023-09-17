import {useCallback, useEffect, useState} from "react";
import {useGomakeAxios} from "@/hooks";
import {
    getAndSetPermissionsRolesRelation, getPermissionRolesRelationsByGroupId,
} from "@/services/hooks/get-set-permissionRoles";
import {useEditPermissionRolesRelationShip} from '../Permissions/use-update-permissionsRoles-relationship';
import {SecondSwitch} from "@/components/switch/second";

const useSettings = () => {
    const {callApi} = useGomakeAxios();
    const [groups, setgroups] = useState([]);
    const [permissionsRoles, setpermissionsRoles] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [permissions, setpermissions] = useState([]);
    const [table, setTable] = useState([]);
    const [PermissionName, setPermissionName] = useState("");
    const [selectedTab, setSelectedTab] = useState<{ id: string; title: string }>();
    const {editPermissionRole} = useEditPermissionRolesRelationShip();

    const getAndSetPermissionRolesRelationsByGroupId = useCallback(async (id) => {
        const data = await getPermissionRolesRelationsByGroupId(callApi, setpermissionsRoles, {id});
        getPermissionsTable(data);
    }, [tableHeaders])
    useEffect(() => {

        if (!!selectedTab) {
            getAndSetPermissionRolesRelationsByGroupId(selectedTab.id).then();
        }
    }, [selectedTab])

    const onSelectTab = (index: number) => {
        const newSelectedTab = groups[index];
        if (!!newSelectedTab) {
            setSelectedTab(newSelectedTab)
        }

    }

    useEffect(() => {console.log(tableHeaders)}, [tableHeaders])
    useEffect(() => {
        if (groups && !selectedTab) {
            setSelectedTab(groups[0])
        }
    }, [groups, selectedTab])

    const UpdatePermission = (roleId, permissionId) => {
        const data = {
            permissionId: permissionId,
            roleId: roleId
        }


        editPermissionRole(data).then(res => {
            if (res?.success) {
                const permissionsList = [...permissions];
                const permission = permissionsList.find(x => x.id == permissionId);
                if (permission) {
                    const isRoleExits = permission.rolesPermissionsRelationships.find(x => x.roleId == roleId);
                    if (isRoleExits) {
                        permission.rolesPermissionsRelationships = permission.rolesPermissionsRelationships.filter(x => x.roleId != roleId)
                    } else {
                        permission.rolesPermissionsRelationships.push({
                            permissionId: permissionId,
                            roleId: roleId
                        })
                    }
                    setpermissions(permissionsList)
                    getPermissionsTable(permissionsList)
                }
            }
        })
    }

    const getPermissionsTable = useCallback((permissions) => {
        const table2 = [];
        permissions.forEach(permission => {
            const row = [];
            row.push(permission.description);
            tableHeaders.forEach(role => {
                const relation = permission.rolesPermissionsRelationships.find(x => x.roleId == role.id)
                if (role.id !== '') {
                    const col = <SecondSwitch checked={!!relation}
                                              onChange={() => UpdatePermission(role.id, permission.id, !!relation)}/>
                    row.push(col);
                }
            });
            table2.push(row)
        })
        setTable(table2);


    }, [tableHeaders])

    const getPermissionRolesRelations = useCallback(async () => {
        const data = await getAndSetPermissionsRolesRelation(callApi, setpermissionsRoles);
        const roles = [...data.roles];
        roles.unshift({id: "", name: " Permission"});
        setTableHeaders(roles);
        setgroups(data.groups)
        setpermissions(data.permissions);
        getPermissionsTable(data.permissions);
    }, [])

    const onChangePermissionSearch = useCallback((value: string) => {
        var permissionsList = [...permissions];
        const filteredPermissions = permissionsList.filter(permission => {
            return permission.description.includes(value);
        });

        getPermissionsTable(filteredPermissions);
        setPermissionName(value);
    }, [PermissionName]);


    useEffect(() => {
        const fetchData = async () => {
            await getPermissionRolesRelations();
        };
        fetchData();
    }, []);
    return {
        tableHeaders,
        permissionsRoles,
        groups,
        permissions,
        table,
        onSelectTab,
        onChangePermissionSearch,
        PermissionName

    };
};

export {useSettings};
