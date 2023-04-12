import { useGomakeAuth, useGomakeRouter } from "@/hooks";
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
  const { isAuth } = useGomakeAuth();
  const { navigate } = useGomakeRouter();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
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
            key: "sheetPaper",
            title: t("tabs.sheetPaper"),
            path: "/materials/sheet-paper",
          },
          {
            key: "lamination",
            title: t("tabs.lamination"),
            path: "/materials/lamination",
          },
          {
            key: "plats",
            title: t("tabs.plats"),
            path: "/materials/plats",
          },
          {
            key: "envelopes",
            title: t("tabs.envelopes"),
            path: "/materials/envelopes",
          },
          {
            key: "tubes",
            title: t("tabs.tubes"),
            path: "/materials/tubes",
          },
          {
            key: "printingMaterialsForRolls",
            title: t("tabs.printingMaterialsForRolls"),
            path: "/materials/printing-materials-for-rolls",
          },
          {
            key: "hardboards",
            title: t("tabs.hardboards"),
            path: "/materials/hardboards",
          },
          {
            key: "wildPrintingMaterials",
            title: t("tabs.wildPrintingMaterials"),
            path: "/materials/wild-printing-materials",
          },
          {
            key: "profileFrames",
            title: t("tabs.profileFrames"),
            path: "/materials/profile-frames",
          },
          {
            key: "applications",
            title: t("tabs.applications"),
            path: "/materials/applications",
          },
          {
            key: "encapsulationRoll",
            title: t("tabs.encapsulationRoll"),
            path: "/materials/encapsulation-roll",
          },
          {
            key: "additions",
            title: t("tabs.additions"),
            path: "/materials/additions",
          },
          {
            key: "canvasFrames",
            title: t("tabs.canvasFrames"),
            path: "/materials/canvas-frames",
          },
          {
            key: "frames",
            title: t("tabs.frames"),
            path: "/materials/frames",
          },
          {
            key: "paperMoney",
            title: t("tabs.paperMoney"),
            path: "/materials/paperMoney",
          },
          {
            key: "safarlaOnTheDrum",
            title: t("tabs.safarlaOnTheDrum"),
            path: "/materials/safarlaOnTheDrum",
          },
          {
            key: "sprellaSingularity",
            title: t("tabs.sprellaSingularity"),
            path: "/materials/sprellaSingularity",
          },
          {
            key: "encapsulationSheets",
            title: t("tabs.encapsulationSheets"),
            path: "/materials/encapsulationSheets",
          },
          {
            key: "colors",
            title: t("tabs.colors"),
            path: "/materials/colors",
          },
          {
            key: "rollOfDoubleSidedGlue",
            title: t("tabs.rollOfDoubleSidedGlue"),
            path: "/materials/rollOfDoubleSidedGlue",
          },
          {
            key: "adhesives",
            title: t("tabs.adhesives"),
            path: "/materials/adhesives",
          },
          {
            key: "magnets",
            title: t("tabs.magnets"),
            path: "/materials/magnets",
          },
          {
            key: "packaging",
            title: t("tabs.packaging"),
            path: "/materials/packaging",
          },
          {
            key: "beat",
            title: t("tabs.beat"),
            path: "/materials/beat",
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
