import {useCallback, useEffect, useState} from "react";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {SecondSwitch} from "@/components/switch/second";
import {IPermission, IPermissionsGroup, IRole} from "@/widgets/settings-users/Permissions/interface";
import {
    getAllPermissionRolesRelationsApi,
    getPermissionRolesRelationsByGroupIdApi,
    updatePermissionApi, updateRoleNameApi
} from "@/services/api-service/users/permissions";
import {TableHeader} from "@/widgets/settings-users/Permissions/components/table-header";
import { useTranslation } from "react-i18next";

const usePermissions = () => {
    const {callApi} = useGomakeAxios();
    const [groups, setgroups] = useState<IPermissionsGroup[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);
    const [table, setTable] = useState<(string | JSX.Element)[][]>([]);
    const [PermissionName, setPermissionName] = useState("");
    const [selectedTab, setSelectedTab] = useState<IPermissionsGroup>();
    const {alertSuccessUpdate, alertFaultUpdate} = useSnackBar();
    const [modalState, setModalState] = useState<boolean>(false);
    const [modalInputValue, setModalInputValue] = useState<string>('');
    const [updateRoleId, setUpdateRoleId] = useState<string>('');
    const {t} = useTranslation();
    const getAndSetPermissionRolesRelationsByGroupId = async (id) => {
        const callBack = (res) => {
            if (res.success) {
                setPermissions(res?.data);
            }
        }
        await getPermissionRolesRelationsByGroupIdApi(callApi, callBack, {id})
    }


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

    const UpdatePermission = async (roleId, permissionId) => {
        const callBackFunction = (res) => {
            if (res?.success) {
                const permissionsList = [...permissions];
                const permission = permissionsList.find(x => x.id == permissionId);
                if (permission) {
                    const isRoleExits = permission.rolesPermissionsRelationships.find(x => x.roleId === roleId);
                    if (isRoleExits) {
                        permission.rolesPermissionsRelationships = permission.rolesPermissionsRelationships.filter(x => x.roleId != roleId)
                    } else {
                        permission.rolesPermissionsRelationships.push({
                            permissionId: permissionId,
                            roleId: roleId,
                            id: ''
                        })
                    }
                    setPermissions(permissionsList)
                }
                alertSuccessUpdate();
            } else {
                alertFaultUpdate();
            }
        }
        const data = {permissionId, roleId};
        await updatePermissionApi(callApi, callBackFunction, data)
    }

    useEffect(() => {
        const permissionsTable: (string | JSX.Element)[][] = permissions.map(permission => {
            const tableRow: JSX.Element[] = roles.filter(role => !!role.id).map(role => {
                const relation = permission.rolesPermissionsRelationships.find(relation => relation.roleId === role.id)
                return <SecondSwitch checked={!!relation} onChange={() => UpdatePermission(role.id, permission.id)}/>
            });
            const translatedDescription = t(`PermissionManagment.Permissions.${permission.description}`);
            return [translatedDescription, ...tableRow]
        })
        setTable(permissionsTable);
    }, [roles, permissions])

    const getPermissionRolesRelations = async () => {
        const callBack = (res) => {
            if (res?.success) {
                setRoles([{id: "", name: "Permission", key: 'permissionsSettings.permissions'}, ...res?.data.roles]);
                const groups = res?.data.groups;
                const translatedGroups = groups.map((item) => ({
                    ...item,
                    name: t(`PermissionManagment.PermissionGroup.${item.name}`),
                  }));
                 setgroups(translatedGroups);
                setPermissions(res?.data.permissions);
            }
        }
        await getAllPermissionRolesRelationsApi(callApi, callBack)
    }


    const onChangePermissionSearch = (value: string) => {
        setPermissionName(value);
    }

    const tableHeaders = useCallback(() => {
        return roles.map(role => <TableHeader headerTitle={role.key ? role.key : role.name} roleId={role.id} onClickUpdate={() => {
            setModalState(true);
            setModalInputValue(role.name);
            setUpdateRoleId(role.id);
        }}/>)
    }, [roles])

    const permissionsTable = useCallback(() => {
        if (PermissionName) {
            return table.filter((row) => typeof row[0] === "string" && row[0].includes(PermissionName))
        } else {
            return table;
        }
    }, [table, PermissionName])

    const tabs = useCallback(() => {
        return groups?.map(group => ({title: group.name}))
    }, [groups])

    const updateRoleName = async () => {
        const callBack = (res) => {
            if (res.success) {
                alertSuccessUpdate();
                setRoles(roles?.map(role => role.id === res.data?.id ? res.data : role));
                setModalInputValue('');
                setUpdateRoleId('');
                setModalState(false);
            }else {
                alertFaultUpdate();
            }
        }
        const role = roles.find(r => r.id === updateRoleId);
        await updateRoleNameApi(callApi, callBack, {
            id: updateRoleId,
            name: modalInputValue,
            recordID: role.recordID
        })
    }
    return {
        roles,
        groups,
        permissions,
        table,
        onSelectTab,
        onChangePermissionSearch,
        PermissionName,
        permissionsTable,
        getPermissionRolesRelations,
        tableHeaders,
        modalState,
        setModalState,
        modalInputValue,
        setModalInputValue,
        tabs,
        updateRoleName
    };
};

export {usePermissions};
