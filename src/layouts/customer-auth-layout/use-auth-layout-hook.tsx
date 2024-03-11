import { useGomakeAuth, useGomakeAxios, useGomakeRouter } from "@/hooks";
import { CustomersIcon, HomeIcon, ProductFloorIcon, ReportsIcon, SalesIcon, SettingNavBar, ShopingIcon, } from "@/icons";

import { useEffect, useMemo, useState } from "react";
import { CubeIcon } from "@/components/icons/cube-icon";
import { useRecoilValue } from "recoil";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { Permissions } from "@/components/CheckPermission/enum";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";

const useAuthLayoutHook = (permissionEnumValue?: Permissions, allowAnonymous?: boolean) => {
  const { isAuth } = useGomakeAuth(permissionEnumValue, allowAnonymous);
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
        tourData: 'menu-home'
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
      // {
      //   isLine: false,
      //   key: "partners",
      //   title: "tabs.partners",
      //   path: "/partners",
      //   isList: false,
      //   icon: () => {
      //     return <PartnersIcon />;
      //   },
      //   isProduction: true,
      // },
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
        list: [
          {
            key: "boardMissions",
            title: "home.tabs.boardMissions",
            Permission: Permissions.SHOW_PRODUCTION_FLOOR,
            path: "/board-missions",
          },
          {
            key: "quotes",
            title: "tabs.quotes",
            path: "/quotes",
            Permission: Permissions.SHOW_QUOTES,
          },
          {
            key: "orders",
            title: "tabs.orders",
            path: "/orders",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "delivery notes",
            title: "tabs.deliveryNotes",
            path: "/deliveryNotes",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "delivery note refund",
            title: "tabs.deliveryNoteRefund",
            path: "/deliveryNoteRefunds",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "invoices",
            title: "tabs.invoices",
            path: "/invoices",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "invoice refund",
            title: "tabs.invoiceRefund",
            path: "/invoiceRefunds",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "purchase order",
            title: "tabs.purchaseOrder",
            path: "/purchaseOrders",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "purchase invoice",
            title: "tabs.purchaseInvoice",
            path: "/purchaseInvoices",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "purchase invoice",
            title: "tabs.purchaseInvoiceRefund",
            path: "/purchaseInvoiceRefunds",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "receipts",
            title: "tabs.receipts",
            path: "/receipts",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "deposits",
            title: "tabs.deposits",
            path: "/deposits",
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
        list: [
          {
            key: "purchaseOrders",
            title: "tabs.purchaseOrders",
            path: "/purchaseOrders",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "purchaseInvoices",
            title: "tabs.purchaseInvoices",
            path: "/purchaseOrder",
            Permission: Permissions.SHOW_ORDERS,
          },
          {
            key: "supplierPayments",
            title: "tabs.supplierPayments",
            path: "/purchaseOrder",
            Permission: Permissions.SHOW_ORDERS,
          },
        ],
        icon: () => {
          return <ShopingIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "contacts",
        title: "tabs.contacts",
        path: "/",
        isList: true,
        list: [
          {
            key: "customers",
            title: "tabs.customers",
            path: "/customers",
            Permission: Permissions.SHOW_CLIENT,
          },
          {
            key: "suppliers",
            title: "tabs.suppliers",
            path: "/suppliers",
            Permission: Permissions.SHOW_SUPPLIER,
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
        Permission: Permissions.SHOW_CLIENT,
        isList: true,
        list: [
          {
            key: "agingReport",
            title: "tabs.agingReport",
            path: "/aging-report",
            Permission: Permissions.SHOW_CLIENT,
          },
          {
            key: "ledgerReport",
            title: "tabs.ledgerReport",
            path: "/ledger-report",
            Permission: Permissions.SHOW_CLIENT,
          },
          {
            key: "transactionJournalReport",
            title: "tabs.transactionJournalReport",
            path: "/transaction-journal-report",
            Permission: Permissions.SHOW_CLIENT,
          },
          {
            key: "dailyPaymentsReport",
            title: "tabs.dailyPaymentsReport",
            path: "/daily-payments-report",
            Permission: Permissions.SHOW_CLIENT,
          },
        ],
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
        Permission: Permissions.SHOW_MATERIALS,
        path: "/materials",
        isList: false,
        icon: () => {
          return <CubeIcon width={24} height={24} color={"white"} />;
        },
        isProduction: true,
        tourData: 'menu-materials'
      },
      {
        isLine: false,
        key: "materialsAdmin",
        title: "tabs.materialsAdmin",
        Permission: Permissions.MATERIALS_ADMIN,
        path: "/materials-admin",
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
        Permission: Permissions.SHOW_MACHINES,
        isList: false,
        icon: () => {
          return <LocalPrintshopOutlinedIcon style={{ color: "#FFFFFF" }} />;
        },
        isProduction: true,
        tourData: 'menuMachines'

      },
      {
        isLine: false,
        key: "machinesAdmin",
        title: "tabs.machinesAdmin",
        path: "/machines-admin",
        Permission: Permissions.MACHINES_ADMIN,
        isList: false,
        icon: () => {
          return <LocalPrintshopOutlinedIcon style={{ color: "#FFFFFF" }} />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "actions",
        title: "tabs.actions",
        path: "/actions",
        Permission: Permissions.SHOW_ACTIONS,
        isList: false,
        icon: () => {
          return <PendingActionsOutlinedIcon style={{ color: "#FFFFFF" }} />;
        },
        isProduction: true,
        tourData: 'menuActions'
      },
      {
        isLine: false,
        key: "settings",
        title: "tabs.settings",
        path: "/settings",
        Permission: Permissions.SHOW_SETTINGS,
        isList: false,
        icon: () => {
          return <SettingNavBar />;
        },
        isProduction: true,
        tourData: 'menu-settings'
      },
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
