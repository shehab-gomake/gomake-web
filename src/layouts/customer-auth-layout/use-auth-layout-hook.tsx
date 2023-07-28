import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import {
  AdminPanel,
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
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";

const useAuthLayoutHook = () => {
  const { t } = useTranslation();
  const { isAuth } = useGomakeAuth();
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const categories = useRecoilValue(machineCategoriesState);
  const tabs: any = useMemo(() => {
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
        path: "/materials",
        isList: false,
        // list: [
        //   {
        //     key: "sheetPaper",
        //     title: t("tabs.sheetPaper"),
        //     path: "/materials/sheet-paper",
        //   },
        //   {
        //     key: "lamination",
        //     title: t("tabs.lamination"),
        //     path: "/materials/lamination",
        //   },
        //   {
        //     key: "plats",
        //     title: t("tabs.plats"),
        //     path: "/materials/plats",
        //   },
        //   {
        //     key: "envelopes",
        //     title: t("tabs.envelopes"),
        //     path: "/materials/envelopes",
        //   },
        //   {
        //     key: "tubes",
        //     title: t("tabs.tubes"),
        //     path: "/materials/tubes",
        //   },
        //   {
        //     key: "printingMaterialsForRolls",
        //     title: t("tabs.printingMaterialsForRolls"),
        //     path: "/materials/printing-materials-for-rolls",
        //   },
        //   {
        //     key: "hardboards",
        //     title: t("tabs.hardboards"),
        //     path: "/materials/hardboards",
        //   },
        //   {
        //     key: "wildPrintingMaterials",
        //     title: t("tabs.wildPrintingMaterials"),
        //     path: "/materials/wild-printing-materials",
        //   },
        //   {
        //     key: "profileFrames",
        //     title: t("tabs.profileFrames"),
        //     path: "/materials/profile-frames",
        //   },
        //   {
        //     key: "applications",
        //     title: t("tabs.applications"),
        //     path: "/materials/applications",
        //   },
        //   {
        //     key: "encapsulationRoll",
        //     title: t("tabs.encapsulationRoll"),
        //     path: "/materials/encapsulation-roll",
        //   },
        //   {
        //     key: "additions",
        //     title: t("tabs.additions"),
        //     path: "/materials/additions",
        //   },
        //   {
        //     key: "canvasFrames",
        //     title: t("tabs.canvasFrames"),
        //     path: "/materials/canvas-frames",
        //   },
        //   {
        //     key: "frames",
        //     title: t("tabs.frames"),
        //     path: "/materials/frames",
        //   },
        //   {
        //     key: "foils",
        //     title: t("tabs.foils"),
        //     path: "/materials/foils",
        //   },
        //   {
        //     key: "packinDrums",
        //     title: t("tabs.packinDrums"),
        //     path: "/materials/packin-drums",
        //   },
        //   {
        //     key: "packinUnits",
        //     title: t("tabs.packinUnits"),
        //     path: "/materials/packin-units",
        //   },
        //   {
        //     key: "sheetEncapsulation",
        //     title: t("tabs.sheetEncapsulation"),
        //     path: "/materials/sheet-encapsulation",
        //   },
        //   {
        //     key: "colors",
        //     title: t("tabs.colors"),
        //     path: "/materials/colors",
        //   },
        //   {
        //     key: "doubleSidedTapeRolls",
        //     title: t("tabs.doubleSidedTapeRolls"),
        //     path: "/materials/double-sided-tape-rolls",
        //   },
        //   {
        //     key: "glues",
        //     title: t("tabs.glues"),
        //     path: "/materials/glues",
        //   },
        //   {
        //     key: "magnets",
        //     title: t("tabs.magnets"),
        //     path: "/materials/magnets",
        //   },
        //   {
        //     key: "packings",
        //     title: t("tabs.packings"),
        //     path: "/materials/packings",
        //   },
        //   {
        //     key: "varnishs",
        //     title: t("tabs.varnishs"),
        //     path: "/materials/varnishs",
        //   },
        // ],
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
        // list: [
        //   {
        //     key: "add",
        //     title: t("Categories"),
        //     path: "/machines",
        //   },
        //   ...categories.map(category => ({key: category.id + category.name, title: category.name, path: `/machines/category/${category.id}`}))
        // ]
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
        isProduction: false,
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
        isProduction: false,
      },
      {
        isLine: false,
        key: "suppliers",
        title: t("tabs.suppliers"),
        path: "/product-floor",
        isList: true,
        list: [
          {
            key: "suppliers",
            title: t("tabs.suppliers"),
            path: "/suppliers",
          },
        ],
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
        key: "settings",
        title: t("tabs.settings"),
        path: "/settings",
        isList: false,
        icon: () => {
          return <SettingNavBar />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "settings",
        title: t("tabs.settings"),
        path: "/product-floor",
        isList: true,
        list: [
          {
            key: "employees",
            title: t("tabs.employees"),
            path: "/settings/employees",
          },
        ],
        icon: () => {
          return <ProductsIcon />;
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
