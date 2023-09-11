import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useGomakeAxios} from "@/hooks";


import {useStyle} from "./style";
import Switch from "@mui/material/Switch";
import {ThemeProvider, createMuiTheme, createTheme} from "@mui/material/styles";
import {
    getAndSetPermissions,
    getAndSetPermissionsRolesRelation,
    getAndSetRoles
} from "@/services/hooks/get-set-permissionRoles";
import {getPermissionRolesRelationsByGroupId} from "@/services/hooks/get-permissions-by-id-group";

const useSettings = () => {
    const {callApi} = useGomakeAxios();
    const {classes} = useStyle();

    const [groups, setgroups] = useState([]);
    const [permissionsRoles, setpermissionsRoles] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [permissions, setpermissions] = useState([]);
    const [table, setTable] = useState([]);
    const [selectedTab, setSelectedTab] = useState<{id: string; title: string}>();
    const {t} = useTranslation();


    useEffect(()=> {
      if (!!selectedTab) {

      }
    }, [selectedTab])
    const onSelectTab = (index: number) => {
        const newSelectedTab = groups[index];
        if (!!newSelectedTab) {
          setSelectedTab(selectedTab)
      }
    }
    const theme = createTheme({
        palette: {
            secondary: {
                main: '#ED028C',
            }
        }
    });
    const getSwitch = (roleId, permissionId) => {
        return (
            <ThemeProvider theme={theme}>
                <Switch color="secondary" checked={true}/>
            </ThemeProvider>
        );

    }
    const getSwitchFale = (roleId, permissionId) => {
        return (
            <ThemeProvider theme={theme}>
                <Switch color="secondary" checked={false}/>
            </ThemeProvider>
        );
    }
    const getPermissionRolesRelations = useCallback(async () => {
        const data = await getAndSetPermissionsRolesRelation(callApi, setpermissionsRoles);
        const roles = [...data.roles]; // Create a new array and copy elements from 'data.roles'
        roles.unshift([]); // Adds an empty array to the beginning of the new 'roles' array
        setTableHeaders(roles);
        setgroups(data.groups)
        setpermissions(data.permissions);
        var col = []
        const row = [col];
        const table2 = [];
        data.permissions.forEach(permission => {
            var row = [];
            row.push(permission.description);
            roles.forEach(role => {
                var relation = permission.rolesPermissionsRelationships.find(x => x.roleId == role.id)
                var col = relation ? getSwitch(role.id, permission.id) : getSwitchFale(role.id, permission.id)
                row.push(col);
            });
            table2.push(row)
        })
        setTable(table2);

    }, [callApi, setpermissionsRoles, t])


    const getAndSetPermissionRolesRelationsByGroupId = useCallback(async () => {
        const data = await getPermissionRolesRelationsByGroupId(callApi, setpermissionsRoles);
    }, [callApi, setpermissionsRoles, t])

    useEffect(() => {
        const fetchData = async () => {
            await getPermissionRolesRelations();
        };

        fetchData();
    }, [getPermissionRolesRelations]);


    console.log(table)

    return {
        tableHeaders,
        permissionsRoles,
        groups,
        permissions,
        table,
        onSelectTab
    };
};

export {useSettings};
