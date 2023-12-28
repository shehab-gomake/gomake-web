import { useGomakeAuth, useGomakeAxios, useGomakeRouter } from "@/hooks";
import {
  CustomersIcon,
  HomeIcon,
  PartnersIcon,
  ProductFloorIcon,
  ProductsIcon,
  ReportsIcon,
  SalesIcon,
  SettingNavBar,
  ShopingIcon,
} from "@/icons";
import { useEffect, useMemo, useState } from "react";
import { CubeIcon } from "@/components/icons/cube-icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { ICompanyProfile, companyProfileState } from "@/store/company-profile";
import { Permissions } from "@/components/CheckPermission/enum";

import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import GTranslateIcon from '@mui/icons-material/GTranslate';
const useAuthLayoutHook = (permissionEnumValue?:Permissions) => {

  const { isAuth } = useGomakeAuth(permissionEnumValue);
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const tabs1: any = useMemo(() => {
    return [
      {
        isLine: false,
        key: "home",
        title: "tabs.home",
        path: "/home",
        isList: false,
        icon: () => {
          return <HomeIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "productFloor",
        title: "tabs.productFloor",
        path: "/production-floor",
        isList: false,
        icon: () => {
          return <ProductFloorIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "partners",
        title: "tabs.partners",
        path: "/partners",
        isList: false,
        icon: () => {
          return <PartnersIcon />;
        },
        isProduction: true,
      },
      {
        isLine: true,
        key: "line_1",
        isProduction: true,
      },
    ];
  }, []);
  const tabs2: any = useMemo(() => {
   
   return [
      {
        isLine: false,
        key: "sales",
        title: "tabs.sales",
        path: "/",
        isList: true,
        Permission:Permissions.SHOW_SALES,
        list: [
          {
            key: "quotes",
            title: "tabs.quotes",
            path: "/quotes",
            Permission:Permissions.SHOW_QUOTES
          },
          {
            key: "orders",
            title: "tabs.orders",
            path: "/orders",
            Permission:Permissions.SHOW_ORDERS
          },
          {
            key: "delivery notes",
            title: "tabs.deliveryNotes",
            path: "/deliveryNotes",
            Permission:Permissions.SHOW_ORDERS
          },
          {
            key: "invoices",
            title: "tabs.invoices",
            path: "/invoices",
            Permission:Permissions.SHOW_ORDERS
          },
          {
            key: "receipts",
            title: "tabs.receipts",
            path: "/receipts",
            Permission:Permissions.SHOW_ORDERS
          },
        ],
        icon: () => {
          return <SalesIcon />;
        },
        isProduction: true,
      },
      // {
      //   isLine: false,
      //   key: "properties",
      //   title: "tabs.properties",
      //   path: "/properties",
      //   isList: false,
      //   icon: () => {
      //     return <ProductsIcon />;
      //   },
      //   isProduction: true,
      // },
      {
        isLine: false,
        key: "purchase",
        title: "tabs.purchase",
        path: "/",
        isList: true,
        Permission:Permissions.SHOW_SHOPPING,
        list: [
          {
            key: "purchaseOrders",
            title: "tabs.purchaseOrders",
            path: "/purchaseOrders",
            Permission:Permissions.SHOW_ORDERS
          },
          {
            key: "purchaseInvoices",
            title: "tabs.purchaseInvoices",
            path: "/purchaseOrder",
            Permission:Permissions.SHOW_ORDERS
          },
          {
            key: "supplierPayments",
            title: "tabs.supplierPayments",
            path: "/purchaseOrder",
            Permission:Permissions.SHOW_ORDERS
          },
        ],
        icon: () => {
          return <ShopingIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "customers",
        title: "tabs.customers",
        path: "/",
        Permission:Permissions.SHOW_CUSTOMERS,
        isList: true,
        list: [
          {
            key: "customers",
            title: "tabs.customers",
            path: "/customers",
            Permission:Permissions.SHOW_CLIENT,
          },
          {
            key: "suppliers",
            title: "tabs.suppliers",
            path: "/suppliers",
            Permission:Permissions.SHOW_SUPPLIER,
          },
        ],
        icon: () => {
          return <CustomersIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "reports",
        title: "tabs.reports",
        path: "/reports",
        Permission:Permissions.SHOW_REPORTS,
        isList: false,
        icon: () => {
          return <ReportsIcon />;
        },
        isProduction: true,
      },
      
    ];
  }, []);
  const tabs3: any = useMemo(() => {
    return [
      {
        isLine: true,
        key: "line_2",
        isProduction: true,
      },
      {
        isLine: false,
        key: "materials",
        title: "tabs.materials",
        Permission:Permissions.SHOW_MATERIALS,
        path: "/materials",
        isList: false,
        icon: () => {
          return <CubeIcon width={24} height={24} color={"white"} />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "machines",
        title: "tabs.machines",
        path: "/machines",
        Permission:Permissions.SHOW_MACHINES,
        isList: false,
        icon: () => {
          return <LocalPrintshopOutlinedIcon style={{color:"#FFFFFF"}}/>;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "actions",
        title: "tabs.actions",
        path: "/actions",
        Permission:Permissions.SHOW_ACTIONS,
        isList: false,
        icon: () => {
          return <PendingActionsOutlinedIcon style={{color:"#FFFFFF"}} />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "settings",
        title: "tabs.settings",
        path: "/settings",
        Permission:Permissions.SHOW_SETTINGS,
        isList: false,
        icon: () => {
          return <SettingNavBar />;
        },
        isProduction: true,
      }
    ];
  }, []);

  useEffect(() => {
    if (typeof isAuth === "boolean") {
      setCanAccess(isAuth);
    }
  }, [isAuth]);
  const { callApi } = useGomakeAxios();
  const profile = useRecoilValue<ICompanyProfile>(companyProfileState);
  // const getUserProfile = async () => {
  //   const res = await callApi("GET", "/v1/get-print-house-profile");
  //   if (res.success) {
  //     setProfile(res?.data?.data?.data);
  //   }
  // };
  // useEffect(() => {
  //   getUserProfile();
  // }, []);

  const permissionsofTabs = [tabs1, tabs2, tabs3];
  

  return {
    permissionsofTabs,
    tabs1,
    tabs2,
    tabs3,
    canAccess,
    profile,
    navigate,
  };
};
export { useAuthLayoutHook };
