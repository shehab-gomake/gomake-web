import { useGomakeAdminAuth, useGomakeRouter } from "@/hooks";
import {
  CustomersIcon,
  HomeIcon,
  ProductFloorIcon,
  ProductsIcon,
  ReportsIcon,
  SalesIcon,
  ShopingIcon,
} from "@/icons";
import { SuppliersIcon } from "@/icons/suppliers";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const useAuthLayoutHook = () => {
  const { t } = useTranslation();
  const { isAuth } = useGomakeAdminAuth();
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const tabs = useMemo(() => {
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
      },
      {
        isLine: true,
        key: "line_1",
      },
      {
        isLine: false,
        key: "materials",
        title: t("tabs.materials"),
        path: "/product-floor",
        isList: true,
        list: [
          {
            key: "sheet",
            title: t("materials.sheetPaper.admin.title"),
            path: "/admin/materials/sheets",
          },
          {
            key: "lamination",
            title: t("materials.lamination.admin.title"),
            path: "/admin/materials/lamination",
          },
          {
            key: "plats",
            title: t("materials.plat.admin.title"),
            path: "/admin/materials/plats",
          },
          {
            key: "envelopes",
            title: t("materials.envelops.admin.title"),
            path: "/admin/materials/envelope",
          },
          {
            key: "tubes",
            title: t("materials.tubes.admin.title"),
            path: "/admin/materials/tube",
          },
          {
            key: "materialRollPrinting",
            title: t("materials.printingMaterials.admin.title"),
            path: "/admin/materials/material-roll-printing",
          },
          {
            key: "wideFormatMaterial",
            title: t("materials.wideFormatMaterial.admin.title"),
            path: "/admin/materials/wide-format-material",
          },
          {
            key: "profileFrame",
            title: t("materials.profileFrames.admin.title"),
            path: "/admin/materials/profile-frame",
          },
        ],
        icon: () => {
          return <ProductsIcon />;
        },
      },
      {
        isLine: false,
        key: "products",
        title: t("tabs.products"),
        path: "/product-floor",
        isList: true,
        icon: () => {
          return <ProductsIcon />;
        },
      },
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
            path: "/sales/add",
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
      },
      {
        isLine: false,
        key: "customers",
        title: t("tabs.customers"),
        path: "/product-floor",
        isList: true,
        icon: () => {
          return <CustomersIcon />;
        },
      },
      {
        isLine: false,
        key: "suppliers",
        title: t("tabs.suppliers"),
        path: "/product-floor",
        isList: true,
        icon: () => {
          return <SuppliersIcon />;
        },
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
      },
    ];
  }, []);

  useEffect(() => {
    if (typeof isAuth === "boolean") {
      setCanAccess(isAuth);
    }
  }, [isAuth]);

  return {
    tabs,
    canAccess,
    navigate,
  };
};
export { useAuthLayoutHook };
