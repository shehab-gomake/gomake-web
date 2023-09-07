import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import {
  CustomersIcon,
  HomeIcon,
  ProductFloorIcon,
  ProductsIcon,
  ReportsIcon,
  SalesIcon,
  SettingNavBar,
  ShopingIcon,
} from "@/icons";
import { SuppliersIcon } from "@/icons/suppliers";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const useAuthLayoutHook = () => {
  const { t } = useTranslation();
  const { isAuth } = useGomakeAuth();
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const tabs1: any = useMemo(() => {
    return [
      {
        isLine: false,
        key: "home",
        title: t("tabs.home"),
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
        title: t("tabs.productFloor"),
        path: "/product-floor",
        isList: false,
        icon: () => {
          return <ProductFloorIcon />;
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
        title: t("tabs.sales"),
        path: "/product-floor",
        isList: true,
        list: [
          {
            key: "add",
            title: t("tabs.addSales"),
            path: "/sales/add-machine",
          },
          {
            key: "list",
            title: t("tabs.listSales"),
            path: "/sales/list",
          },
        ],
        icon: () => {
          return <SalesIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "shoping",
        title: t("tabs.shoping"),
        path: "/product-floor",
        isList: true,
        icon: () => {
          return <ShopingIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "customers",
        title: t("tabs.customers"),
        path: "/customers",
        isList: true,
        list: [
          {
            key: "customers",
            title: t("tabs.customers"),
            path: "/customers",
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
        title: t("tabs.reports"),
        path: "/product-floor",
        isList: true,
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
        title: t("tabs.materials"),
        path: "/materials",
        isList: false,
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "machines",
        title: t("tabs.machines"),
        path: "/machines",
        isList: false,
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "settings",
        title: t("tabs.settings"),
        path: "/settings",
        isList: false,
        icon: () => {
          return <SettingNavBar />;
        },
        isProduction: true,
      },
    ];
  }, []);

  useEffect(() => {
    if (typeof isAuth === "boolean") {
      setCanAccess(isAuth);
    }
  }, [isAuth]);

  return {
    tabs1,
    tabs2,
    tabs3,
    canAccess,
    navigate,
  };
};
export { useAuthLayoutHook };
