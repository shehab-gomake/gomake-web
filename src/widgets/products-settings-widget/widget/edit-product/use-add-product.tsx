import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAndSetProductById } from "@/services/hooks";
import { GraphicIcon, PrameterIcon, SettingIcon } from "@/widgets";

const useAddProduct = () => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();

  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [productState, setProductState] = useState<any>([]);
  const dir: "rtl" | "ltr" = t("direction");
  const onChangeStateProduct = useCallback(
    (filedName: string, value: any) => {
      setProductState((prev) => {
        return {
          ...prev,
          [filedName]: value,
        };
      });
    },
    [productState]
  );
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const [activeTab, setActiveTab] = useState(t("products.addProduct.admin.settings"));
  const onClickSettingsTab = () => {
    setActiveTab(t("products.addProduct.admin.settings"));
  }; 
  const onClickParametersTab = () => {
    setActiveTab(t("products.addProduct.admin.parameters"));
  };
  const onClickGraphicTab = () => {
    setActiveTab(t("products.addProduct.admin.graphic"));
  };
  useEffect(() => {
    if (router.query.isParameter) setActiveTab(t("products.addProduct.admin.parameters"));
  }, [router]);

  const tabs = [
    {
      name: t("products.addProduct.admin.settings"),
      icon: <SettingIcon stroke="#1C1D58" />,
      activeIcon: <SettingIcon />,
      onclick: () => onClickSettingsTab,
    },
    {
      name: t("products.addProduct.admin.parameters"),
      icon: <PrameterIcon />,
      activeIcon: <PrameterIcon stroke="#ED028C" />,
      onclick: () => onClickParametersTab,
    },
    {
      name: t("products.addProduct.admin.graphic"),
      icon: <GraphicIcon />,
      activeIcon: <GraphicIcon stroke="#ED028C" />,
      onclick: () => onClickGraphicTab,
    },
  ];

  const getProductById = useCallback(async () => {
    if (router?.query?.id) {
      await getAndSetProductById(callApi, setProductState, {
        Id: router?.query?.id,
      });
    }
  }, [router, setProductState, activeIndex]);

  useEffect(() => {
    getProductById();
  }, [router, setProductState, activeIndex]);

  const handleGoBack = () => {
    router.back();
  };

  return {
    t,
    handleTabClick,
    onClickParametersTab,
    onChangeStateProduct,
    productState,
    activeIndex,
    activeTab,
    tabs,
    router,
    dir,
    handleGoBack,
  };
};

export { useAddProduct };