import {GoMakeTextInputIcon} from "@/components";
import StickyFirstColumnTable from "@/components/StickyTable/StickyFirstColumnTable";
import {AddPlusIcon, SearchIcon} from "@/icons";
import {FONT_FAMILY} from "@/utils/font-family";
import {HeaderTitle} from "@/widgets/header-title";
import {useState} from "react";
import {InputAdornment, createMuiTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useStyle} from "./style";
import {AddRoleModal} from "./modals";
import {useSettings} from "./use-settings";
import {SecondaryTabsComponent} from "@/components/tabs/secondary-tabs";


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
 
 
    const {tableHeaders, groups, table, onSelectTab} =
        useSettings();
    const tabs = [];
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
                <div style={{display: "flex", width: "100%", justifyContent: "flex-end", flexDirection: "row"}}>
                    <div style={classes.subHeaderRightSide}>
                        <GoMakeTextInputIcon
                            style={classes.searchInputContainer}
                            placeholder={t("header.search")}
                            startAdornment={
                                <InputAdornment position="start">
                                    <div style={classes.iconStyle}>
                                        <SearchIcon/>
                                    </div>
                                </InputAdornment>
                            }
                        />
                    </div>
                </div>
                <div style={{width:"95%"}}>
                <StickyFirstColumnTable columns={tableHeaders} data={table}/>

                </div>
                

            </div>
            
         


        </div>
    )
}

export {PermissionsWidget};