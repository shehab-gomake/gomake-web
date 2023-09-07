import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";


import { useStyle } from "./style";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import { PrameterIcon } from "../shared-admin-customers";
import { getAndSetRoles } from "@/services/hooks/get-set-permissionRoles";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();

  const [roles,setRoles] = useState([]);
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
    const newTableHeaders = [ t("permissionsSettings.Permission") ];

    if (data) {
      data.forEach((row) => {
        newTableHeaders.push( row.text );
      });
    }

    setTableHeaders(newTableHeaders);
  }, [callApi, setTableHeaders, t]);
  useEffect(() => {
    getRoles();
  }, [getRoles]);

  const allProducts = [  { Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  },
{Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> },
{Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  },
{Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  },
{Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> },
{ Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  },
{Permission: "Edit Profile", prdouctionManager:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Graphics:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,ServiceAndSales:  <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  , Production: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  ,ServiceAndSaleManager: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider> ,Director: <ThemeProvider theme={theme}><Switch   color="secondary" /></ThemeProvider>  },
]


  return {
    tableHeaders,
    allProducts
  
  };
};

export { useSettings };
