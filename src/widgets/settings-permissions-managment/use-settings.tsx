import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { matchSorter } from "match-sorter";

import { getAllProductsMongoDB } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";


import { useStyle } from "./style";
import { MoreMenuWidget } from "../products-settings-widget/widget/more-circle";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import { ThemeProvider, createMuiTheme } from "@mui/material/styles";
import { PrameterIcon } from "../shared-admin-customers";

const useSettings = () => {
  const { callApi } = useGomakeAxios();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const theme = createMuiTheme({
    palette: {
      secondary: {
        main: '#ED028C',
      },
    },
  });
  const getActions = useCallback(async () => {
    const data = await getAllProductsMongoDB(callApi);
    const mapData = data?.map((item: any) => {
      return {
        code: item?.code,
        name: item?.name,
        details: item?.details,
        groups: (
          <div>
            {item?.groups.map((group) => {
              return (
                <div
                  style={{
                    marginBottom: 5,
                  }}
                >
                  {group.name}
                </div>
              );
            })}
          </div>
        ),
      };
    });
  }, []);
  useEffect(() => {
    getActions();
  }, []);
  const tableHeaders = [{
    text: t("permissionsSettings.Permission"),
    icon: "", // Replace <EditIcon /> with your actual icon component
  },{
    text: t("permissionsSettings.Production manager"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },{
    text: t("permissionsSettings.Graphics"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },{
    text: t("permissionsSettings.Services and sales"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },{
    text: t("permissionsSettings.Production"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },{
    text: t("permissionsSettings.Service and Sales Manager"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },
  {
    text: t("permissionsSettings.Director"),
    icon: <PrameterIcon />, // Replace <EditIcon /> with your actual icon component
  },
  ];

  useEffect(() => {
   
  }, []);
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
