import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { getAndSetProductById } from "@/services/hooks";
import { GraphicIcon, PrameterIcon, PricingIcon, SettingIcon } from "@/widgets";
import { ESourceView } from "@/enums/products";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { EProductStructureType } from "@/widgets/shared-admin-customers/add-product/settings/settings-data";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
const useAddProduct = () => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { secondColor, primaryColor } = useGomakeTheme();
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

  const [activeTab, setActiveTab] = useState(
    t("products.addProduct.admin.settings")
  );
  const onClickSettingsTab = () => {
    setActiveTab(t("products.addProduct.admin.settings"));
  };
  const onClickParametersTab = () => {
    setActiveTab(t("products.addProduct.admin.parameters"));
  };
  const onClickGraphicTab = () => {
    setActiveTab(t("products.addProduct.admin.graphic"));
  };
  const onClickWorkFlowsTab = () => {
    setActiveTab(t("pricingWidget.workFlow"));
  };
  const onClickHotFolderTab = () => {
    setActiveTab(t("pricingWidget.hotFolder"));
  };
  const { CheckPermission } = useUserPermission();

  useEffect(() => {
    if (
      router.query.isParameter &&
      productState?.productStructureType !== EProductStructureType.COMPOSITE
    ) {
      setActiveTab(t("products.addProduct.admin.parameters"));
    }
  }, [router, productState?.productStructureType, t]);

  useEffect(() => {
    if (
      productState?.productStructureType === EProductStructureType.COMPOSITE &&
      activeTab !== t("products.addProduct.admin.settings")
    ) {
      setActiveTab(t("products.addProduct.admin.settings"));
    }
  }, [productState?.productStructureType, activeTab, t]);

  const tabs = useMemo(() => {
    const baseTabs = [
      {
        name: t("products.addProduct.admin.settings"),
        icon: <SettingIcon stroke={primaryColor(600)} />,
        activeIcon: <SettingIcon stroke={secondColor(500)} />,
        onclick: () => onClickSettingsTab,
        permission: true,
      },
      {
        name: t("products.addProduct.admin.parameters"),
        icon: <PrameterIcon stroke={primaryColor(600)} />,
        activeIcon: <PrameterIcon stroke={secondColor(500)} />,
        onclick: () => onClickParametersTab,
        permission: true,
      },
      {
        name: t("pricingWidget.workFlow"),
        icon: <PricingIcon stroke={primaryColor(600)} />,
        activeIcon: <PricingIcon stroke={secondColor(500)} />,
        onclick: () => onClickWorkFlowsTab,
        permission: CheckPermission(Permissions.ADD_WORK_FLOW_TO_PRODUCT),
      },
      {
        name: t("pricingWidget.hotFolder"),
        icon: <WhatshotIcon style={{ color: primaryColor(600) }} />,
        activeIcon: <WhatshotIcon style={{ color: secondColor(500) }} />,
        onclick: () => onClickHotFolderTab,
        permission: CheckPermission(Permissions.ADD_HOT_FOLDER_TO_PRODUCT),
      },
      // {
      //   name: t("products.addProduct.admin.graphic"),
      //   icon: <GraphicIcon stroke={primaryColor(600)} />,
      //   activeIcon: <GraphicIcon stroke={secondColor(500)} />,
      //   onclick: () => onClickGraphicTab,
      //   permission: true,
      // },
    ];

    const visibleTabs = baseTabs.filter((tab) => tab.permission);

    if (
      productState?.productStructureType === EProductStructureType.COMPOSITE
    ) {
      return visibleTabs.filter(
        (tab) => tab.name === t("products.addProduct.admin.settings")
      );
    }

    return visibleTabs;
  }, [
    productState?.productStructureType,
    t,
    CheckPermission,
    onClickSettingsTab,
    onClickParametersTab,
    onClickWorkFlowsTab,
    onClickHotFolderTab,
  ]);

  const getProductById = useCallback(async () => {
    if (router?.query?.id) {
      await getAndSetProductById(callApi, setProductState, {
        Id: router?.query?.id,
        sourceView: ESourceView.ProductEditView,
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
    getProductById,
  };
};

export { useAddProduct };
