import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

import { SettingIcon } from "./icons/setting";
import { PrameterIcon } from "./icons/parameter";
import { GraphicIcon } from "./icons/graphic";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";

const useAddProduct = () => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { t } = useTranslation();
  const [productState, setProductState] = useState<any>([]);
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [template, setTemplate] = useState<any>();
  const handleTabClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };
  const handleNextClick = () => {
    if (activeIndex < template.sections.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  const handlePreviousClick = () => {
    if (activeIndex != 0) {
      setActiveIndex(activeIndex - 1);
    }
  };
  const [activeTab, setActiveTab] = useState("Settings");
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
    if (router?.query?.productId) {
      const data = await getAndSetProductById(callApi, setTemplate, {
        Id: router?.query?.productId,
      });
      setProductState(data);
    }
  }, [router]);

  useEffect(() => {
    getProductById();
  }, []);
  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onClickParametersTab,
    onChangeStateProduct,
    productState,
    activeIndex,
    template,
    activeTab,
    tabs,
  };
};

export { useAddProduct };
