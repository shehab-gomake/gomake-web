import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { companyProfileState, ICompanyProfile } from "@/store/company-profile";
import { Permissions } from "@/components/CheckPermission/enum";
import { HomeIcon } from "@/icons/side-list-icons/home";
import { ProductionFloorIcon } from "@/icons/side-list-icons/production-floor";
import { SalesIcon } from "@/icons/side-list-icons/sales";
import { PurchaseIcon } from "@/icons/side-list-icons/purchase";
import { BankingIcon } from "@/icons/side-list-icons/banking";
import { ContactsIcon } from "@/icons/side-list-icons/contacts";
import { ReportsIcon } from "@/icons/side-list-icons/reports";
import {
  MaterialsAdminIcon,
  MaterialsIcon,
} from "@/icons/side-list-icons/material";
import {
  MachinesAdminIcon,
  MachinesIcon,
} from "@/icons/side-list-icons/machines";
import { ActionsIcon } from "@/icons/side-list-icons/actions";
import { SettingsIcon } from "@/icons/side-list-icons/settings";
import { CustomerServiceIcon } from "@/icons/side-list-icons/customer-service";
import { AIIcon } from "@/icons/side-list-icons/ai";

const useAuthLayoutHook = (
  permissionEnumValue?: Permissions,
  allowAnonymous?: boolean
) => {
  const { isAuth, isLanguageUpdated } = useGomakeAuth(
    permissionEnumValue,
    allowAnonymous
  );
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const profile = useRecoilValue<ICompanyProfile>(companyProfileState);

  const changeRoute = useCallback((route: string) => {
    navigate(route);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    changeRoute("/login");
  };

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
        tourData: "menu-home",
      },
      {
        isLine: false,
        key: "goAI",
        title: "Go-AI",
        path: "/gomake-ai",
        Permission: Permissions.SHOW_GOMAKE_AI,
        isList: false,
        icon: () => {
          return <AIIcon />;
        },
        isProduction: true,
        tourData: "menu-go-ai",
      },

      {
        isLine: false,
        key: "productFloor",
        title: "tabs.productFloor",
        path: "/production-floor?view=table",
        isList: false,
        Permission: Permissions.SHOW_PRODUCTION_FLOOR,
        icon: () => {
          return <ProductionFloorIcon />;
        },
        isProduction: true,
      },
    ];
  }, []);

  const tabs2: any = useMemo(() => {
    return [
      {
        isLine: true,
        key: "line_1",
        isProduction: true,
      },
      {
        isLine: false,
        key: "sales",
        title: "tabs.sales",
        path: "/",
        isList: true,
        list: [
          {
            key: "jobs",
            title: "home.tabs.jobs",
            Permission: Permissions.SHOW_BOARD_MISSIONS,
            path: "/jobs",
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
            Permission: Permissions.SHOW_DELIVERY_NOTES,
          },
          {
            key: "delivery note refund",
            title: "tabs.deliveryNoteRefund",
            path: "/deliveryNoteRefunds",
            Permission: Permissions.SHOW_DELIVERY_NOTES_REFUND,
          },
          {
            key: "invoices",
            title: "tabs.invoices",
            path: "/invoices",
            Permission: Permissions.SHOW_INVOICES,
          },
          {
            key: "invoice refund",
            title: "tabs.invoiceRefund",
            path: "/invoiceRefunds",
            Permission: Permissions.SHOW_INVOICES_REFUND,
          },
          {
            key: "deliveries",
            title: "tabs.deliveries",
            path: "/deliveries",
            Permission: Permissions.SHOW_DELIVERIES,
          },
          {
            key: "dashboard",
            title: "tabs.dashboard",
            path: "/dashboard",
            Permission: Permissions.SHOW_SALES_DASHBOARD,
          },
          {
            key: "productionDashboard",
            title: "tabs.productionDashboard",
            path: "/production-dashboard",
            Permission: Permissions.SHOW_SALES_DASHBOARD,
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
            key: "purchaseJobs",
            title: "tabs.purchaseJobs",
            path: "/purchase-jobs",
            Permission: Permissions.SHOW_PURCHASE_INVOICES_REFUND,
          },
          {
            key: "purchase order",
            title: "tabs.purchaseOrder",
            path: "/purchaseOrders",
            Permission: Permissions.SHOW_PURCHASE_ORDERS,
          },
          {
            key: "purchase invoice",
            title: "tabs.purchaseInvoice",
            path: "/purchaseInvoices",
            Permission: Permissions.SHOW_PURCHASE_INVOICES,
          },
          {
            key: "purchase invoice refund",
            title: "tabs.purchaseInvoiceRefund",
            path: "/purchaseInvoiceRefunds",
            Permission: Permissions.SHOW_PURCHASE_INVOICES_REFUND,
          },
        ],
        icon: () => {
          return <PurchaseIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "banking",
        title: "tabs.banking",
        path: "/",
        isList: true,
        list: [
          {
            key: "receipts",
            title: "tabs.receipts",
            path: "/receipts",
            Permission: Permissions.SHOW_RECEIPTS,
          },
          {
            key: "payments",
            title: "tabs.supplierPayments",
            path: "/supplier-payments",
            Permission: Permissions.SHOW_SUPPLIER_PAYMENTS,
          },
          {
            key: "deposits",
            title: "tabs.deposits",
            path: "/deposits",
            Permission: Permissions.SHOW_DEPOSITS,
          },
        ],
        icon: () => {
          return <BankingIcon />;
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
          return <ContactsIcon />;
        },
        isProduction: true,
      },

      {
        isLine: false,
        key: "customerReports",
        title: "tabs.customerReports",
        isList: true,
        list: [
          {
            key: "agingReport",
            title: "tabs.agingReport",
            path: "/aging-report",
            Permission: Permissions.SHOW_AGING_REPORT,
          },
          {
            key: "ledgerReport",
            title: "tabs.customerLedger",
            path: "/ledger-report",
            Permission: Permissions.SHOW_LEDGER_REPORT,
          },

          {
            key: "dailyPaymentsReport",
            title: "tabs.receiptsReport",
            path: "/daily-payments-report",
            Permission: Permissions.SHOW_DAILY_PAYMENT_REPORT,
          },
          {
            key: "salesReport",
            title: "tabs.salesReport",
            path: "/sales-report",
            Permission: Permissions.SHOW_SALES_REPORT,
          },
          {
            key: "creditCardTransactions",
            title: "tabs.creditCardTransactions",
            path: "/credit-card-transactions",
            Permission: Permissions.SHOW_CREDIT_CARD_TRANSACTIONS,
          },
          {
            key: "vatReport",
            title: "tabs.vatReport",
            path: "/vat-report",
            Permission: Permissions.SHOW_VAT_REPORT,
          },
          {
            key: "mailingLogs",
            title: "mailingSettings.messageLogs",
            path: "/mailing-logs",
            Permission: Permissions.SHOW_MAILING_LOGS,
          },
        ],
        icon: () => {
          return <ReportsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "supplierReports",
        title: "tabs.supplierReports",
        isList: true,
        list: [
          {
            key: "supplierAging",
            title: "tabs.supplierAging",
            path: "/supplier-aging",
            Permission: Permissions.SHOW_SUPPLIER_AGING_REPORT,
          },
          {
            key: "supplierLedger",
            title: "tabs.supplierLedger",
            path: "/supplier-ledger",
            Permission: Permissions.SHOW_SUPPLIER_LEDGER_REPORT,
          },
          {
            key: "paymentsReport",
            title: "tabs.paymentsReport",
            path: "/payments-report",
            Permission: Permissions.SHOW_SUPPLIER_PAYMENT_REPORT,
          },
          {
            key: "purchasesReport",
            title: "tabs.purchasesReport",
            path: "/purchases-report",
            Permission: Permissions.SHOW_PURCHASES_REPORT,
          },
        ],
        icon: () => {
          return <ReportsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "accountingReports",
        title: "tabs.accountingReports",
        isList: true,
        list: [
          // {
          //   key: "transactionJournalReport",
          //   title: "tabs.transactionJournalReport",
          //   path: "/transaction-journal-report",
          //   Permission: Permissions.SHOW_TRANSACTION_JOURNAL_REPORT,
          // },
          {
            key: "accountingTransactionReport",
            title: "tabs.accountingTransactionReport",
            path: "/accounting-transaction-report",
            Permission: Permissions.SHOW_TRANSACTION_JOURNAL_REPORT,
          },
          {
            key: "adjustmentsReport",
            title: "tabs.adjustmentsReport",
            path: "/adjustments-report",
            Permission: Permissions.SHOW_TRANSACTION_JOURNAL_REPORT,
          },
          {
            key: "exportFiles",
            title: "tabs.exportFiles",
            path: "/export-files",
            Permission: Permissions.SHOW_FINANCE,
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
          return <MaterialsIcon />;
        },
        isProduction: true,
        tourData: "menu-materials",
      },
      {
        isLine: false,
        key: "materialsAdmin",
        title: "tabs.materialsAdmin",
        Permission: Permissions.MATERIALS_ADMIN,
        path: "/materials-admin",
        isList: false,
        icon: () => {
          return <MaterialsAdminIcon />;
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
          return <MachinesIcon />;
        },
        isProduction: true,
        tourData: "menuMachines",
      },
      {
        isLine: false,
        key: "machinesAdmin",
        title: "tabs.machinesAdmin",
        path: "/machines-admin",
        Permission: Permissions.MACHINES_ADMIN,
        isList: false,
        icon: () => {
          return <MachinesAdminIcon />;
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
          return <ActionsIcon />;
        },
        isProduction: true,
        tourData: "menuActions",
      },

      {
        isLine: false,
        key: "companyReports",
        title: "companyReports.printhouseReport",
        path: "/companyReports",
        Permission: Permissions.SHOW_PRINTHOUSES_TABLE,
        isList: false,
        icon: () => {
          return <ReportsIcon />;
        },
        isProduction: true,
        tourData: "menu-companyReports",
      },
    ];
  }, []);

  const tabs4: any = useMemo(() => {
    return [
      {
        isLine: true,
        key: "line_2",
        isProduction: true,
      },
      {
        isLine: false,
        key: "customerService",
        title: "tabs.customerService",
        path: "/customer-service-admin",
        Permission: Permissions.SHOW_ADMIN_CUSTOMER_SERVICE,
        isList: false,
        icon: () => {
          return <CustomerServiceIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "settings",
        title: "tabs.settings",
        path: "/settings",
        isList: false,
        icon: () => {
          return <SettingsIcon />;
        },
        isProduction: true,
        tourData: "menu-settings",
      },
      // Add any other new tabs here as needed
    ];
  }, []);

  useEffect(() => {
    if (allowAnonymous) {
      setCanAccess(true);
      return;
    }
    if (typeof isAuth === "boolean") {
      setCanAccess(isAuth && isLanguageUpdated);
    }
  }, [isAuth, isLanguageUpdated]);

  const permissionsOfTabs = [tabs1, tabs2, tabs3, tabs4];

  return {
    permissionsOfTabs,
    tabs1,
    tabs2,
    tabs3,
    tabs4,
    canAccess,
    profile,
    navigate,
    handleLogout,
  };
};

export { useAuthLayoutHook };
