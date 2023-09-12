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
        console.log("tableHeader="+tableHeaders)
        getPermissionsTable(data);
    }, [tableHeaders])
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
    
    useEffect(()=> {
        if(groups && !selectedTab) {
            setSelectedTab(groups[0])
        }
    }, [groups, selectedTab])
    const theme = createTheme({
        palette: {
            secondary: {
                main: '#ED028C',
            }
        }
    });
    const UpdatePermission = (roleId,permissionId,isChecked) => {
        const data  = {
            permissionId:permissionId,
            roleId:roleId
        }
    
        setVal(!isChecked); 
        editPrmissionRole(data);
    }
    const getSwitch = (roleId, permissionId, isChecked) => {
    
        return (
            <ThemeProvider theme={theme}>
                <Switch
                    color="secondary"
                    onClick={() => UpdatePermission(roleId, permissionId, isChecked)}
                    checked={isChecked}
                />
            </ThemeProvider>
        );
    }
    const getPermissionsTable = useCallback((permissions) => {
        debugger
        var col = []
        const row = [];
        const table2 = [];

        permissions.forEach(permission => {
            var row = [];
            row.push(permission.description);
            tableHeaders.forEach(role => {
                debugger
                var relation = permission.rolesPermissionsRelationships.find(x => x.roleId == role.id)
                if(role.id !== '')
                {
                     var col = relation && relation !== undefined   ? getSwitch(role.id, permission.id,true) : getSwitch(role.id, permission.id,false)
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
        roles.unshift({id : "" , name : " Permission"});
        setTableHeaders(roles);
        setgroups(data.groups)
        setpermissions(data.permissions);
        getPermissionsTable(data.permissions);
    }, [])


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
        onSelectTab
    };
};

export {useSettings};
