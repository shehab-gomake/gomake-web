import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAndSetProductById } from "@/services/hooks";
import { useRouter } from "next/router";
import {
  GraphicIcon,
  HiddenIcon,
  NotHiddenIcon,
  PrameterIcon,
  SettingIcon,
} from "@/widgets";
import {
  GoMakeAutoComplate,
  GomakeTextInput,
  SecondSwitch,
} from "@/components";
import { useMaterials } from "../use-materials";
import { useRecoilState, useRecoilValue } from "recoil";
import { materialsCategoriesState } from "@/store/material-categories";
import { digitslPriceState } from "./store";

const useAddProduct = ({ clasess }) => {
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
  const updateProductParameterEndPoint = async (
    sectionId: string,
    subSectionId: string,
    data: any
  ) => {
    const res = await callApi(
      "PUT",
      `/v1/printhouse-config/products/update-product-parameter`,
      {
        productId: router?.query?.productId,
        sectionId: sectionId,
        subSectionId: subSectionId,
        productParameterType: 1,
        ...data,
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
  };
  const updatedProductParameterHidden = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isHidden: !parameter?.isHidden,
        },
      });
    },
    [router]
  );

  const updatedProductParameteRequierd = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isRequired: !parameter?.isRequired,
        },
      });
    },
    [router]
  );

  const updatedProductParameteName = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          name: changeName?.length ? changeName : parameter.name,
        },
      });
      setChangeName("");
    },
    [router, changeName]
  );
  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          defaultValue: changeDefaultValue?.length && changeDefaultValue,
        },
      });
      setChangeDefaultValue("");
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
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          defaultValue: value.toString(),
        },
      });
    },
    [router]
  );

  const updatedProductParameterValuesConfigsHidden = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      option: any
    ) => {
      let temp = [...parameter?.valuesConfigs];

      let objectIdToUpdate = option?.id;

      const updatedArray = temp.map((obj) => {
        if (obj.id === objectIdToUpdate) {
          return { ...obj, isHidden: !obj.isHidden };
        }
        return obj;
      });
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          valuesConfigs: updatedArray,
        },
      });
    },
    [router]
  );
  const updatedProductParameterValuesConfigsDefault = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      option: any
    ) => {
      let temp = [...parameter?.valuesConfigs];

      let objectIdToUpdate = option?.id;

      const updatedArray = temp.map((obj) => {
        if (obj.id === objectIdToUpdate) {
          return { ...obj, isDefault: true };
        } else {
          return { ...obj, isDefault: false };
        }
      });
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          valuesConfigs: updatedArray,
        },
      });
    },
    [router]
  );
  const updatedParameterMaterialTypeValuesConfigsDefault = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      option: any
    ) => {
      let temp = [...parameter?.valuesConfigs];
      if (temp?.length <= 0) {
        temp.push({
          id: uuidv4(),
          isHidden: false,
          isDefault: true,
          isDeleted: false,
          materialValueIds: [
            {
              path: option?.pathName,
              valueId: option?.valueId,
            },
          ],
        });
        await updatedValuesConfigsForParameters(sectionId, subSectionId, {
          ...parameter,
          valuesConfigs: temp,
        });
      } else {
        let objectIdToUpdate = option?.id;
        if (objectIdToUpdate) {
          const updatedArray = temp.map((obj) => {
            if (obj.id === objectIdToUpdate) {
              return { ...obj, isDefault: true };
            } else {
              return { ...obj, isDefault: false };
            }
          });
          await updateProductParameterEndPoint(sectionId, subSectionId, {
            parameter: {
              ...parameter,
              valuesConfigs: updatedArray,
            },
          });
        } else {
          temp.push({
            id: uuidv4(),
            isHidden: false,
            isDefault: true,
            isDeleted: false,
            materialValueIds: [
              {
                path: option?.pathName,
                valueId: option?.valueId,
              },
            ],
          });
          const updatedArray = temp.map((obj) => {
            if (obj.id === objectIdToUpdate) {
              return { ...obj, isDefault: true };
            } else {
              return { ...obj, isDefault: false };
            }
          });
          await updatedValuesConfigsForParameters(sectionId, subSectionId, {
            ...parameter,
            valuesConfigs: updatedArray,
          });
        }
      }
    },
    [router]
  );

  const updatedValuesConfigsForParameters = useCallback(
    async (sectionId: string, subSectionId: string, data: any) => {
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

  const [openModal, setOpenModal] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<any>({});

  const [selectedSectonId, setSelectedSectonId] = useState({});
  const [selectedSubSection, setSelectedSubSection] = useState({});
  const onCloseModal = () => {
    setSelectedParameter({});
    setOpenModal(false);
  };
  const onOpenModal = (parameter, sectionId, subSectionId) => {
    setSelectedParameter(parameter);
    setSelectedSectonId(sectionId);
    setSelectedSubSection(subSectionId);
    setTimeout(() => {
      setOpenModal(true);
    }, 100);
  };
  const { allMaterials } = useMaterials();
  const materialsEnumsValues = useRecoilValue(materialsCategoriesState);
  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const _renderParameterType = (sectionId, subSectionId, parameter) => {
    if (parameter?.parameterType === 1) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          onChange={(e: any) => setChangeDefaultValue(e.target.value)}
          onBlur={() =>
            updatedProductParameteDefaultValue(
              sectionId,
              subSectionId,
              parameter
            )
          }
          type="number"
        />
      );
    } else if (parameter?.parameterType === 2) {
      return (
        <GomakeTextInput
          style={clasess.textInputStyle}
          defaultValue={parameter.defaultValue}
          placeholder={parameter.name}
          type="text"
          onChange={(e: any) => setChangeDefaultValue(e.target.value)}
          onBlur={() =>
            updatedProductParameteDefaultValue(
              sectionId,
              subSectionId,
              parameter
            )
          }
        />
      );
    } else if (parameter?.parameterType === 0) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={defaultObject}
          onChange={(e: any, value: any) => {
            updatedProductParameterValuesConfigsDefault(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
          renderOption={(props: any, option: any) => {
            return (
              <div style={clasess.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div>
                  {option.isHidden ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <HiddenIcon />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <NotHiddenIcon />
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 3) {
      return (
        <SecondSwitch
          checked={parameter?.defaultValue === "true"}
          onChange={(a: any, value: any) => {
            updatedProductParameteDefaultValueForSwitch(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 6) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <GoMakeAutoComplate
          options={parameter?.valuesConfigs}
          placeholder={parameter.name}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={defaultObject}
          onChange={(e: any, value: any) => {
            updatedProductParameterValuesConfigsDefault(
              sectionId,
              subSectionId,
              parameter,
              value
            );
          }}
          renderOption={(props: any, option: any) => {
            return (
              <div style={clasess.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div>
                  {option.isHidden ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <HiddenIcon />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        updatedProductParameterValuesConfigsHidden(
                          sectionId,
                          subSectionId,
                          parameter,
                          option
                        )
                      }
                    >
                      <NotHiddenIcon />
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
      );
    } else if (parameter?.parameterType === 5) {
      if (allMaterials?.length > 0) {
        const data = materialsEnumsValues.find(
          (item) => item.name === parameter?.materialPath[0]
        );
        let options: any = allMaterials;
        if (parameter?.materialPath?.length == 3) {
          options = digitalPriceData?.selectedMaterialLvl2;
        }
        if (parameter?.materialPath?.length == 2) {
          options = digitalPriceData?.selectedMaterialLvl1;
        }
        if (parameter?.materialPath?.length == 1) {
          options = allMaterials?.find((material) => {
            return material.pathName === parameter?.materialPath[0];
          })?.data;
        }
        console.log("options", options);
        return (
          options?.length > 0 && (
            <GoMakeAutoComplate
              options={options}
              placeholder={parameter.name}
              style={clasess.dropDownListStyle}
              getOptionLabel={(option: any) => option.value}
              onChange={(e: any, value: any) => {
                if (parameter?.materialPath?.length == 3) {
                  // onChangeForPrice(
                  //   parameter?.id,
                  //   subSectionId,
                  //   sectionId,
                  //   parameter?.parameterType,
                  //   parameter?.name,
                  //   parameter?.actionId,
                  //   {
                  //     valueId: value?.valueId,
                  //     value: value?.value,
                  //     ...(data?.id > 0 && { material: data?.id }),
                  //   },

                  // );
                  updatedParameterMaterialTypeValuesConfigsDefault(
                    sectionId,
                    subSectionId,
                    parameter,
                    value
                  );
                  setDigidatPriceData({
                    ...digitalPriceData,
                    selectedMaterialLvl3: value,
                    selectedOptionLvl3: value,
                  });
                }
                if (parameter?.materialPath?.length == 2) {
                  // onChangeForPrice(
                  //   parameter?.id,
                  //   subSectionId,
                  //   sectionId,
                  //   parameter?.parameterType,
                  //   parameter?.name,
                  //   parameter?.actionId,
                  //   {
                  //     valueId: value?.valueId,
                  //     value: value?.value,
                  //     ...(data?.id > 0 && { material: data?.id }),
                  //   },
                  // );
                  updatedParameterMaterialTypeValuesConfigsDefault(
                    sectionId,
                    subSectionId,
                    parameter,
                    value
                  );
                  setDigidatPriceData({
                    ...digitalPriceData,
                    selectedMaterialLvl2: value?.data,
                    selectedOptionLvl2: value,
                    selectedMaterialLvl3: null,
                  });
                }
                if (parameter?.materialPath?.length == 1) {
                  updatedParameterMaterialTypeValuesConfigsDefault(
                    sectionId,
                    subSectionId,
                    parameter,
                    value
                  );
                  // onChange={(e: any, value: any) => {

                  // }}
                  // onChangeForPrice(
                  //   parameter?.id,
                  //   subSectionId,
                  //   sectionId,
                  //   parameter?.parameterType,
                  //   parameter?.name,
                  //   parameter?.actionId,
                  //   {
                  //     valueId: value?.valueId,
                  //     value: value?.value,
                  //     ...(data?.id > 0 && { material: data?.id }),
                  //   },
                  // );
                  setDigidatPriceData({
                    ...digitalPriceData,
                    selectedMaterialLvl1: value?.data,
                    selectedOptionLvl1: value,
                    selectedMaterialLvl2: null,
                    selectedMaterialLvl3: null,
                  });
                }
              }}
            />
          )
        );
      }
    }
  };
  return {
    setOpenModal,
    setSelectedParameter,
    setSelectedSectonId,
    setSelectedSubSection,
    onCloseModal,
    _renderParameterType,
    onOpenModal,
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
    selectedSubSection,
    selectedSectonId,
    selectedParameter,
    openModal,
  };
};

export { useAddProduct };
