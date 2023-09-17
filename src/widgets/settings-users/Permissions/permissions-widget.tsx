
import StickyFirstColumnTable from "@/components/StickyTable/StickyFirstColumnTable";
import {HeaderTitle} from "@/widgets/header-title";
import { createMuiTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useStyle} from "./style";
import {useSettings} from "./use-settings";
import {SecondaryTabsComponent} from "@/components/tabs/secondary-tabs";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import { AddRoleModal } from "../Permissions/modals/index";
import { useState } from "react";


const PermissionsWidget = () => {
    const {t} = useTranslation();
    const {classes} = useStyle();
   
    const theme = createMuiTheme({
        palette: {
            secondary: {
                main: '#ED028C',
            },
        },
    });
    const [isNewRole, setisNewRole] = useState(false);
    const [roleId, setroleId] = useState();
    const onClickCloseNewRole = () => {
        setisNewRole(false);
    };
 
    
    const {tableHeaders, groups, table, onSelectTab,onChangePermissionSearch,PermissionName} =
        useSettings();
    const tabs = [];
    const headers = [];

    const ColorOutLineIcon = (roleId) =>{
        return(
            <BorderColorOutlinedIcon  onClick={()=>UpdateRoleModal(roleId)}/>
        )
    }


    const UpdateRoleModal = (roleId) => {
        setisNewRole(true);
        setroleId(roleId);
    }


    tableHeaders?.forEach((row) =>{
        headers.push({name : row.name,icon : <ColorOutLineIcon style={{cursor:"pointer"}} roleId={row.id} />})
    })
    groups?.forEach((row) => {
        tabs.push({title: row.name , selectedTab :  onSelectTab});
    });

    return (
        <div style={classes.mainContainer}>
            <div style={classes.mainHeadecontainer}>
                <HeaderTitle title={t("permissionsSettings.title")} marginBottom={3}/>
            </div>
            <div style={{width: "98%"}}>
                <SecondaryTabsComponent tabs={tabs} onSelectTab={onSelectTab}/>
            </div>
            <div style={{display:"flex",flexDirection:"column",width:"71%"}}>
                <div style={{display: "flex", width: "85%", justifyContent: "flex-end", flexDirection: "row",marginBottom:10}}>
                      <SearchInputComponent onChange={onChangePermissionSearch} value={PermissionName} />
                </div>
                <div style={{width:"95%"}}>
                     <StickyFirstColumnTable columns={headers} data={table}/>
                </div>
            </div>
            <AddRoleModal  
            openModal={isNewRole}
                modalTitle={t("permissionsSettings.UpdateRole")}
                onClose={onClickCloseNewRole} 
                roleId={roleId}
                updateRole={true}
                />
        </div>
    )
}

export {PermissionsWidget};