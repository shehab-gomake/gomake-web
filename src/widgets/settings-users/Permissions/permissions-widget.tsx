import { GoMakeTextInputIcon } from "@/components";
import StickyFirstColumnTable from "@/components/StickyTable/StickyFirstColumnTable";
import { AddPlusIcon, SearchIcon } from "@/icons";
import { FONT_FAMILY } from "@/utils/font-family";
import { HeaderTitle } from "@/widgets/header-title";

import { useState } from "react";
import { InputAdornment, Tab, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, ThemeProvider, createMuiTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { AddRoleModal } from "./modals";
import { useSettings } from "./use-settings";


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
    const {tableHeaders,permissions,permissionDesc,permissionsRoles} =
    useSettings();

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
              <ThemeProvider theme={theme}>
                  <Tabs sx={{ minHeight: 'unset', minWidth: 'unset' }} value={selectedTab} onChange={handleTabChange} textColor="secondary"  indicatorColor="secondary">
                      <Tab  sx={{ color: selectedTab === 0 ? '#ED028C' : '#1C1D58',  marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px",textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.General")} />
                      <Tab sx={{  color: selectedTab === 1 ? '#ED028C' : '#1C1D58', marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Book keeping")} />
                      <Tab sx={{  color: selectedTab === 2 ? '#ED028C' : '#1C1D58', marginLeft:"3px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Boards")} />
                      <Tab sx={{  color: selectedTab === 3 ? '#ED028C' : '#1C1D58', marginLeft:"3px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px",  textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Orders and quotes")} />
                      <Tab sx={{  color: selectedTab === 4 ? '#ED028C' :  '#1C1D58', marginLeft:"3px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px",  textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Work order")} />
                      <Tab sx={{  color: selectedTab === 5 ? '#ED028C' : '#1C1D58', marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Users")} />
                      <Tab sx={{  color: selectedTab === 6 ? '#ED028C' : '#1C1D58', marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px", textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Tenders and fixed price lists")} />
                      <Tab sx={{  color: selectedTab === 7 ? '#ED028C' : '#1C1D58', marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px",textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.Add/update price screen")} />
                      <Tab sx={{  color: selectedTab === 8 ? '#ED028C' : '#1C1D58', marginLeft:"4px",marginRight:"4px",paddingLeft:"1px",paddingRight:"1px",  textTransform: 'none', fontStyle: "normal", ...FONT_FAMILY.Lexend(500, 16), lineHeight: "normal", }} label={t("permissionsSettings.editing an order")} />
                  </Tabs>
              </ThemeProvider>
        
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

       
          <StickyFirstColumnTable columns={tableHeaders} data={permissionDesc} /> 

          <AddRoleModal
              openModal={isNewRole}
              modalTitle={t("permissionsSettings.AddNewRole")}
              onClose={onClickCloseNewRole}
           
          />
  
          
      </div>
  )
}

export {PermissionsWidget};