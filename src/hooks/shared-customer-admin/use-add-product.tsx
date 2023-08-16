import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";

import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";
import { GraphicIcon, PrameterIcon, SettingIcon } from "@/widgets";

const useAddProduct = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();

  const router = useRouter();
  const { t } = useTranslation();
  const [productState, setProductState] = useState<any>([]);
  const [changeName, setChangeName] = useState("");
  const [changeDefaultValue, setChangeDefaultValue] = useState("");
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
  }, [router, template]);

  useEffect(() => {
    getProductById();
  }, [router]);

  const updatedProductParameterHidden = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: !parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );

  const updatedProductParameteRequierd = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: !parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );
  const updatedProductParameteName = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: changeName,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router, changeName]
  );
  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: changeDefaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router, changeDefaultValue]
  );
  const updatedProductParameteDefaultValueForSwitch = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      value: boolean
    ) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: value.toString(),
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: parameter?.valuesConfigs,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );

  const updatedProductParameterValuesConfigsHidden = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any, option) => {
      let temp = [...parameter?.valuesConfigs];

      let objectIdToUpdate = option?.id;

      const updatedArray = temp.map((obj) => {
        if (obj.id === objectIdToUpdate) {
          return { ...obj, isHidden: !obj.isHidden };
        }
        return obj;
      });
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: updatedArray,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );
  const updatedProductParameterValuesConfigsDefault = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any, option) => {
      let temp = [...parameter?.valuesConfigs];

      let objectIdToUpdate = option?.id;

      const updatedArray = temp.map((obj) => {
        if (obj.id === objectIdToUpdate) {
          return { ...obj, isDefault: true };
        } else {
          return { ...obj, isDefault: false };
        }
      });
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: {
            id: parameter?.id,
            name: parameter?.name,
            defaultValue: parameter?.defaultValue,
            parameterType: parameter?.parameterType,
            isHidden: parameter?.isHidden,
            isRequired: parameter?.isRequired,
            valuesConfigs: updatedArray,
          },
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );

  const updatedValuesConfigsForParameters = useCallback(
    async (sectionId: string, subSectionId: string, data: any) => {
      console.log("data", data);
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.productId,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: data,
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProductById();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [router]
  );

  return {
    t,
    handleTabClick,
    handleNextClick,
    handlePreviousClick,
    onClickParametersTab,
    onChangeStateProduct,
    updatedProductParameterHidden,
    updatedProductParameteRequierd,
    updatedProductParameteName,
    setChangeName,
    setChangeDefaultValue,
    updatedProductParameteDefaultValue,
    updatedProductParameteDefaultValueForSwitch,
    updatedProductParameterValuesConfigsHidden,
    updatedProductParameterValuesConfigsDefault,
    updatedValuesConfigsForParameters,
    changeDefaultValue,
    changeName,
    productState,
    activeIndex,
    template,
    activeTab,
    tabs,
  };
};

export { useAddProduct };
