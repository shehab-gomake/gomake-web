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
 
    const [isNewRole, setisNewRole] = useState(false);
    const onClickCloseNewRole = () => {
        setisNewRole(false);
    };
    const {tableHeaders, groups, table, onSelectTab} =
        useSettings();
    const tabs = [];
    groups?.forEach((row) => {
        tabs.push({title: row.name , selectedTab :  onSelectTab});
    });

    return (
        <div style={classes.mainContainer}>
            <div style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end", width: "100%"}}>
                <div
                    style={classes.addProductBtnStyle}
                    onClick={() => setisNewRole(true)}

                >
                    <AddPlusIcon stroke="#101020"/>
                    <div style={classes.addProductBtnText}>
                        {t("permissionsSettings.AddRole")}
                    </div>
                </div>

            </div>

            <div style={classes.mainHeadecontainer}>

                <HeaderTitle title={t("permissionsSettings.title")} marginBottom={3}/>
            </div>
            <div style={{width: "98%"}}>
                <SecondaryTabsComponent tabs={tabs} onSelectTab={onSelectTab}/>
            </div>
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

            <StickyFirstColumnTable columns={tableHeaders} data={table}/>

            <AddRoleModal
                openModal={isNewRole}
                modalTitle={t("permissionsSettings.AddNewRole")}
                onClose={onClickCloseNewRole}

            />


        </div>
    )
}

export {PermissionsWidget};