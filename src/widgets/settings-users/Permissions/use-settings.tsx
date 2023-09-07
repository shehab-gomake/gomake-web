import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks";


import { useStyle } from "./style";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import { getAndSetPermissions, getAndSetRoles } from "@/services/hooks/get-set-permissionRoles";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();

  const [roles,setRoles] = useState([]);
  const [permissions,setpermissions] =  useState([]);
  const [permissionDesc , setpermissionDesc] = useState([]);
  const [permissionsRoles,setpermissionsRoles] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const { t } = useTranslation();
  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#ED028C',
      },
    },
  });
  const getRoles = useCallback(async () => {
    const data = await getAndSetRoles(callApi, setRoles);
    const newTableHeaders = [ { text : t("permissionsSettings.Permission") , icon : "" }];
  

    if (data) {
      data.forEach((row) => {
        newTableHeaders.push( {text : row.text , icon : "" } );
      });
    }

    setTableHeaders(newTableHeaders);
  }, [callApi, setTableHeaders, t]);

  const getPermissions = useCallback(async () => {
   const data = await getAndSetPermissions(callApi, setpermissions);
  const PermissionTable = [];
   if (data) {
    data.forEach((row) => {
      PermissionTable.push( {Permision : row.description  } );
    });
    setpermissionDesc(PermissionTable);
  }
  
  },[callApi, setpermissions, t]);
  const getPermissionRolesRelations = useCallback(async () => {
    await getAndSetPermissions(callApi, setpermissionsRoles);
  
  },[callApi, setpermissionsRoles, t])
  useEffect(() => {
    getRoles();
    getPermissions();
    getPermissionRolesRelations();
  }, [getRoles,getPermissions,getPermissionRolesRelations]);

  return {
    tableHeaders,
    permissions,
    permissionDesc,
    permissionsRoles,
  };
};

export { useSettings };
