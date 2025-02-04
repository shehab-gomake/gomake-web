import { useGomakeAdminAuth, useGomakeRouter } from "@/hooks";
import {
  AdminPanel,
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
        path: "/admin",
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
        isProduction: false,
      },
      {
        isLine: true,
        key: "line_1",
      },
      {
        isLine: false,
        key: "materials",
        title: t("tabs.materials"),
        path: "/admin/materials",
        isList: false,
        list: [
          {
            key: "sheet",
            title: t("materials.sheetPaper.title"),
            path: "/admin/materials/sheets",
          },
          {
            key: "lamination",
            title: t("materials.lamination.title"),
            path: "/admin/materials/lamination",
          },
          {
            key: "plats",
            title: t("materials.plat.title"),
            path: "/admin/materials/plats",
          },
          {
            key: "envelopes",
            title: t("materials.envelops.title"),
            path: "/admin/materials/envelope",
          },
          {
            key: "tubes",
            title: t("materials.tubes.title"),
            path: "/admin/materials/tube",
          },
          {
            key: "materialRollPrinting",
            title: t("materials.printingMaterials.title"),
            path: "/admin/materials/materials-roll-printing",
          },
          {
            key: "wideFormatMaterial",
            title: t("materials.wideFormatMaterial.title"),
            path: "/admin/materials/wide-format-materials",
          },
          {
            key: "hardboards",
            title: t("materials.hardboards.title"),
            path: "/admin/materials/hardboards",
          },
          {
            key: "profileFrame",
            title: t("materials.profileFrames.title"),
            path: "/admin/materials/profile-frame",
          },
          {
            key: "applications",
            title: t("materials.applications.title"),
            path: "/admin/materials/applications",
          },
          {
            key: "rollEncapsulation",
            title: t("materials.encapsulationRoll.title"),
            path: "/admin/materials/roll-encapsulation",
          },
          {
            key: "additions",
            title: t("materials.additions.title"),
            path: "/admin/materials/additions",
          },
          {
            key: "canvasFrames",
            title: t("materials.canvasFrames.title"),
            path: "/admin/materials/canvans-frames",
          },
          {
            key: "packinUnits",
            title: t("materials.packinUnits.title"),
            path: "/admin/materials/packin-units",
          },
          {
            key: "frames",
            title: t("materials.frames.title"),
            path: "/admin/materials/frame",
          },
          {
            key: "foils",
            title: t("materials.foils.title"),
            path: "/admin/materials/foil",
          },
          {
            key: "packinDrums",
            title: t("materials.packinDrums.title"),
            path: "/admin/materials/packin-drums",
          },
          {
            key: "doubleSidedTapeRoll",
            title: t("materials.doubleSidedTapeRolls.title"),
            path: "/admin/materials/double-sided-tape-roll",
          },
          {
            key: "sheetEncapsulation",
            title: t("materials.sheetEncapsulation.title"),
            path: "/admin/materials/sheet-encapsulation",
          },
          {
            key: "magnet",
            title: t("materials.magnets.title"),
            path: "/admin/materials/magnets",
          },
          {
            key: "packings",
            title: t("materials.packings.title"),
            path: "/admin/materials/packings",
          },
          {
            key: "varnish",
            title: t("materials.varnishs.title"),
            path: "/admin/materials/varnish",
          },
        ],
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "machines",
        title: t("tabs.machines"),
        path: "/admin/machine",
        isList: false,
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      // {
      //   isLine: false,
      //   key: "products",
      //   title: t("tabs.products"),
      //   path: "/product-floor",
      //   isList: true,
      //   list: [
      //     {
      //       key: "actions",
      //       title: t("tabs.actions"),
      //       path: "/admin/products/actions",
      //     },
      //     {
      //       key: "add-product",
      //       title: t("tabs.addProduct"),
      //       path: "/admin/products/add-product",
      //     },
      //     {
      //       key: "digital-offset-price",
      //       title: t("tabs.offsetPrice"),
      //       path: "/admin/products/digital-offset-price",
      //     },
      //     {
      //       key: "parameters",
      //       title: t("tabs.parameters"),
      //       path: "/admin/products/parameters",
      //     },
      //     {
      //       key: "profits",
      //       title: t("tabs.profits"),
      //       path: "/admin/products/profits",
      //     },
      //   ],
      //   icon: () => {
      //     return <ProductsIcon />;
      //   },
      // },
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
          {
            key: "quote",
            title: t("sales.quote.title"),
            path: "/admin/sales/quote",
          },
        ],
        icon: () => {
          return <SalesIcon />;
        },
        isProduction: false,
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
        isProduction: false,
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
        isProduction: false,
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
        isProduction: false,
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
        isProduction: false,
      },
      {
        isLine: true,
        key: "line_2",
      },
      {
        isLine: false,
        key: "admin_panel",
        title: t("tabs.adminPanel"),
        path: "/admin-panel",
        isList: false,
        icon: () => {
          return <AdminPanel />;
        },
        isProduction: false,
      },
      // {
      //   isLine: false,
      //   key: "settings",
      //   title: t("tabs.settings"),
      //   path: "/admin/settings",
      //   isList: false,
      //   icon: () => {
      //     return <SettingNavBar />;
      //   },
      //   isProduction: true,
      // },
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
