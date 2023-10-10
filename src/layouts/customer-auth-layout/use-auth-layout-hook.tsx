import { useGomakeAuth, useGomakeAxios, useGomakeRouter } from "@/hooks";
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
import { useEffect, useMemo, useState } from "react";
import { CubeIcon } from "@/components/icons/cube-icon";
import { useRecoilState } from "recoil";
import { ICompanyProfile, companyProfileState } from "@/store/company-profile";

const useAuthLayoutHook = () => {
  const { isAuth } = useGomakeAuth();
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
        title: "tabs.sales",
        path: "/product-floor",
        isList: true,
        list: [
          {
            key: "add",
            title: "tabs.addSales",
            path: "/sales/add-machine",
          },
          {
            key: "list",
            title: "tabs.listSales",
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
        key: "properties",
        title: "tabs.properties",
        path: "/properties",
        isList: false,
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "shoping",
        title: "tabs.shoping",
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
        title: "tabs.customers",
        path: "/customers",
        isList: true,
        list: [
          {
            key: "customers",
            title: "tabs.customers",
            path: "/customers",
          },
          {
            key: "suppliers",
            title: "tabs.suppliers",
            path: "/suppliers",
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
        title: "tabs.materials",
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
        isList: false,
        icon: () => {
          return <ProductsIcon />;
        },
        isProduction: true,
      },
      {
        isLine: false,
        key: "actions",
        title: "tabs.actions",
        path: "/actions",
        isList: false,
        icon: () => {
          return <ProductsIcon />;
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
  const { callApi } = useGomakeAxios();
  const [profile, setProfile] =
    useRecoilState<ICompanyProfile>(companyProfileState);
  const getUserProfile = async () => {
    const res = await callApi("GET", "/v1/get-print-house-profile");
    if (res.success) {
      setProfile(res?.data?.data?.data);
    }
  };
  useEffect(() => {
    getUserProfile();
  }, []);

  return {
    tabs1,
    tabs2,
    tabs3,
    canAccess,
    profile,
    navigate,
  };
};
export { useAuthLayoutHook };
