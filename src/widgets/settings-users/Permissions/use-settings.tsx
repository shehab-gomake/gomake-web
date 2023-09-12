import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useGomakeAxios} from "@/hooks";
import Switch from "@mui/material/Switch";
import {ThemeProvider, createMuiTheme, createTheme} from "@mui/material/styles";
import {
    getAndSetPermissionsRolesRelation, getPermissionRolesRelationsByGroupId,
} from "@/services/hooks/get-set-permissionRoles";
import { useEditPermissionRolesRelationShip } from '../Permissions/use-update-permissionsRoles-relationship';

const useSettings = () => {
    const {callApi} = useGomakeAxios();
    const [groups, setgroups] = useState([]);
    const [permissionsRoles, setpermissionsRoles] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [permissions, setpermissions] = useState([]);
    const [table, setTable] = useState([]);
    const [selectedTab, setSelectedTab] = useState<{id: string; title: string}>();
    const {t} = useTranslation();

    const { editPrmissionRole } = useEditPermissionRolesRelationShip();
    const [Val, setVal] = useState(false); 
   
    const getAndSetPermissionRolesRelationsByGroupId = useCallback(async (id) => {
        const data = await getPermissionRolesRelationsByGroupId(callApi, setpermissionsRoles,{id});
        getPermissionsTable(data,tableHeaders);
    }, [ ])
    useEffect(()=> {
    
      if (!!selectedTab) {
        getAndSetPermissionRolesRelationsByGroupId(selectedTab.id)
      }
    }, [selectedTab])
    const onSelectTab = (index: number) => {
        const newSelectedTab = groups[index];
        if (!!newSelectedTab) {
          setSelectedTab(newSelectedTab)
      }

    }
    const theme = createTheme({
        palette: {
            secondary: {
                main: '#ED028C',
            }
        }
    });
    const UpdatePermission = (roleId,permissionId) => {
        const data  = {
            permissionId:permissionId,
            roleId:roleId
        }
        setVal((prevVal) => !prevVal);
        editPrmissionRole(data);
    }
    const getSwitch = (roleId, permissionId) => {
        return (
            <ThemeProvider theme={theme}>
                <Switch color="secondary"  onClick={() => UpdatePermission(roleId,permissionId)} checked={true}/>
            </ThemeProvider>
        );

    }
    const getSwitchFale = (roleId, permissionId) => {
        return (
            <ThemeProvider theme={theme}>
                <Switch color="secondary"  onClick={() => UpdatePermission(roleId,permissionId)} checked={false}/>
            </ThemeProvider>
        );
    }

    const getPermissionsTable = (permissions,roles) =>{
        var col = []
        const row = [];
        const table2 = [];
        permissions.forEach(permission => {
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

    };
    const getPermissionRolesRelations = useCallback(async () => {
        const data = await getAndSetPermissionsRolesRelation(callApi, setpermissionsRoles);
        const roles = [...data.roles];
        roles.unshift({}); 
        setTableHeaders(roles);
        setgroups(data.groups)
        setpermissions(data.permissions);
        getPermissionsTable(data.permissions,roles);
    }, [callApi, setpermissionsRoles, t])


    useEffect(() => {
        const fetchData = async () => {
            await getPermissionRolesRelations();
        };

        fetchData();
    }, [getPermissionRolesRelations]);

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
