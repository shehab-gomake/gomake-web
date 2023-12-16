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
  const onChangeStateProduct = useCallback(
    (filedName: string, value: any) => {
      console.log("ssss", { filedName, value });
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

  const [activeTab, setActiveTab] = useState("Parameters");
  const onClickSettingsTab = () => {
    setActiveTab("Settings");
  };
  const onClickParametersTab = () => {
    setActiveTab("Parameters");
  };
  const onClickGraphicTab = () => {
    setActiveTab("Graphic");
  };
  const tabs = [
    {
      name: "Settings",
      icon: <SettingIcon stroke="#1C1D58" />,
      activeIcon: <SettingIcon />,
      onclick: () => onClickSettingsTab,
    },
    {
      name: "Parameters",
      icon: <PrameterIcon />,
      activeIcon: <PrameterIcon stroke="#ED028C" />,
      onclick: () => onClickParametersTab,
    },
    {
      name: "Graphic",
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
  return {
    t,
    handleTabClick,
    onClickParametersTab,
    onChangeStateProduct,
    productState,
    activeIndex,
    activeTab,
    tabs,
  };
};

export { useAddProduct };
