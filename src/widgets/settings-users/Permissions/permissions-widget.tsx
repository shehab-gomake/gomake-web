import { GoMakeTextInputIcon } from "@/components";
import StickyFirstColumnTable from "@/components/StickyTable/StickyFirstColumnTable";
import { AddPlusIcon, SearchIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { HeaderTitle } from "@/widgets/header-title";
import { useState } from "react";
import { InputAdornment, Tab, Table,TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { AddRoleModal } from "./modals";
import { useSettings } from "./use-settings";
import {  SecondaryTabsComponent } from "@/components/tabs/secondary-tabs";


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
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    
    };
    const [isNewRole, setisNewRole] = useState(false);
    const onClickCloseNewRole = () => {
      setisNewRole(false);
    };
    const [selectedTab, setSelectedTab] = useState(0);
    const {tableHeaders,permissionsRoles,groups,table,permissions} =
    useSettings();
    const tabs = [];
    groups?.forEach((row) => {
        tabs.push({ title: row.name});
      });
   
  return (
      <div style={classes.mainContainer}>
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"flex-end",width:"100%"}}>
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
          <div style={{width:"98%"}}>
          <SecondaryTabsComponent tabs={tabs} />
              {/* <ThemeProvider theme={theme}>
                  <Tabs sx={{ minHeight: 'unset', minWidth: 'unset' }} value={selectedTab} onChange={handleTabChange} textColor="secondary"  indicatorColor="secondary">
                  {groups?.map(x => (
                        <Tab
                        key={x} // Don't forget to add a unique key when rendering an array of components
                        sx={{
                            color: selectedTab === 0 ? '#ED028C' : '#1C1D58',
                            marginLeft: '4px',
                            marginRight: '4px',
                            paddingLeft: '1px',
                            paddingRight: '1px',
                            textTransform: 'none',
                            fontStyle: 'normal',
                            ...FONT_FAMILY.Lexend(500, 16),
                            lineHeight: 'normal',
                        }}
                        label={x.name}
                        />
                    ))}
                  </Tabs>   
              </ThemeProvider> */}
        
          </div>
          <div style={{display:"flex",width:"100%",justifyContent:"flex-end",flexDirection:"row"}}>
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

        <StickyFirstColumnTable columns={tableHeaders} data={table} /> 

          <AddRoleModal
              openModal={isNewRole}
              modalTitle={t("permissionsSettings.AddNewRole")}
              onClose={onClickCloseNewRole}
           
          />
  
         
      </div>
  )
}

export {PermissionsWidget};