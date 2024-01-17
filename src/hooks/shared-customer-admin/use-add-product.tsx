import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { v4 as uuidv4 } from "uuid";

import { getAndSetProductById } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { compareStrings } from "@/utils/constants";
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
import { digitslPriceState } from "./store";
import { EParameterTypes } from "@/enums";

const useAddProduct = ({ clasess }) => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const [expanded, setExpanded] = useState<string | false>("");
  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };
  const router = useRouter();
  const { t } = useTranslation();
  const [productState, setProductState] = useState<any>([]);
  const [changeName, setChangeName] = useState("");
  const [changeDefaultValue, setChangeDefaultValue] = useState("");
  const { allMaterials, getAllMaterial } = useMaterials();
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
    if (router?.query?.id) {
      const data = await getAndSetProductById(callApi, setTemplate, {
        Id: router?.query?.id,
      });
      setProductState(data);
    }
  }, [router, template]);

  useEffect(() => {
    getAllMaterial().then(() => {
      getProductById();
    });
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
        productId: router?.query?.id,
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
      if (changeName !== parameter?.name && changeName?.length) {
        await updateProductParameterEndPoint(sectionId, subSectionId, {
          parameter: {
            ...parameter,
            name: changeName?.length ? changeName : parameter.name,
          },
        });
        setChangeName("");
      }
    },
    [router, changeName]
  );
  const updatedProductParameteDefaultValue = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any) => {
      if (changeDefaultValue !== parameter?.defaultValue) {
        await updateProductParameterEndPoint(sectionId, subSectionId, {
          parameter: {
            ...parameter,
            defaultValue: changeDefaultValue?.length
              ? changeDefaultValue
              : parameter?.defaultValue,
          },
        });
        setChangeDefaultValue("");
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
      debugger;
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
      option: any,
      subSectionParameters,
      level: number
    ) => {
      debugger;
      let temp = [...parameter?.valuesConfigs];
      if (temp?.length <= 0) {
        temp.push({
          id: uuidv4(),
          isHidden: false,
          isDefault: true,
          isDeleted: false,
          value: option?.value,
          materialValueIds: [
            {
              path: option?.pathName,
              valueId: option?.valueId,
              value: option?.value,
            },
          ],
        });
        await updatedValuesConfigsForParameters(sectionId, subSectionId, {
          ...parameter,
          valuesConfigs: temp,
        });
      } else {
        let objectIdToUpdate = option?.valueId;
        if (
          temp.findIndex(
            (item) => item?.materialValueIds[0]?.valueId === objectIdToUpdate
          ) !== -1
        ) {
          const updatedArray = temp.map((obj) => {
            if (obj.materialValueIds[0]?.valueId === objectIdToUpdate) {
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
            value: option?.value,
            materialValueIds: [
              {
                path: option?.pathName,
                valueId: option?.valueId,
                value: option?.value,
              },
            ],
          });
          const updatedArray = temp.map((obj) => {
            if (obj.materialValueIds[0]?.valueId === objectIdToUpdate) {
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
      /*if (level === 1) {
        const lvl2 = subSectionParameters?.find(
          (item) =>
            item?.materialPath[0] === parameter?.materialPath[0] &&
            item.materialPath.length == 2
        );
        await updatedValuesConfigsForParameters(sectionId, subSectionId, {
          ...lvl2,
          valuesConfigs: [],
        });
      } else if (level === 2) {
      }*/
    },
    [router]
  );

  const updatedParameterMaterialTypeValuesConfigsHidden = useCallback(
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
          isHidden: true,
          isDefault: false,
          isDeleted: false,
          value: option?.value,
          materialValueIds: [
            {
              path: option?.pathName,
              valueId: option?.valueId,
              value: option?.value,
            },
          ],
        });
        await updatedValuesConfigsForParameters(sectionId, subSectionId, {
          ...parameter,
          valuesConfigs: temp,
        });
      } else {
        let objectIdToUpdate = option?.valueId;
        if (
          temp.findIndex(
            (item) => item?.materialValueIds[0]?.valueId === objectIdToUpdate
          ) !== -1
        ) {
          const updatedArray = temp.map((obj) => {
            if (obj?.materialValueIds[0]?.valueId === objectIdToUpdate) {
              return { ...obj, isHidden: !obj.isHidden };
            }
            return obj;
          });
          await updatedValuesConfigsForParameters(sectionId, subSectionId, {
            ...parameter,
            valuesConfigs: updatedArray,
          });
        } else {
          temp.push({
            id: uuidv4(),
            isHidden: true,
            isDefault: false,
            isDeleted: false,
            value: option?.value,
            materialValueIds: [
              {
                path: option?.pathName,
                valueId: option?.valueId,
                value: option?.value,
              },
            ],
          });
          await updatedValuesConfigsForParameters(sectionId, subSectionId, {
            ...parameter,
            valuesConfigs: temp,
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
          productId: router?.query?.id,
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

  const [digitalPriceData, setDigidatPriceData] =
    useRecoilState<any>(digitslPriceState);
  const _renderParameterType = (
    sectionId,
    subSectionId,
    parameter,
    subSectionParameters
  ) => {
    if (parameter?.parameterType === EParameterTypes.INPUT_NUMBER) {
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
    } else if (parameter?.parameterType === EParameterTypes.INPUT_TEXT) {
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
    } else if (parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST) {
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
    } else if (parameter?.parameterType === EParameterTypes.SWITCH) {
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
    } else if (
      parameter?.parameterType === EParameterTypes.SELECT_CHILDS_PARAMETERS
    ) {
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
    } else if (parameter?.parameterType === EParameterTypes.SELECT_MATERIALS) {
      if (allMaterials?.length > 0) {
        let isDefaultObj = parameter?.valuesConfigs?.find(
          (item) => item.isDefault === true
        );
        let options: any = allMaterials;
        let defailtObjectValue = {};
        if (parameter?.materialPath?.length == 3) {
          options = digitalPriceData?.selectedMaterialLvl2;
          let x = options?.find(
            (item: any) =>
              item?.valueId === isDefaultObj?.materialValueIds[0]?.valueId
          );
          defailtObjectValue = x;
        }
        if (parameter?.materialPath?.length == 2) {
          let defsultParameters = subSectionParameters?.find((item) =>
            item.valuesConfigs?.find((item) => item?.isDefault)
          );
          let defaultParameter = defsultParameters?.valuesConfigs?.find(
            (item) => item?.isDefault
          );
          let valueIdIsDefault = defaultParameter?.materialValueIds[0]?.valueId;

          options = digitalPriceData?.selectedMaterialLvl1;

          if (!!!options) {
            let optionsLvl1 = allMaterials
              ?.find((material) => {
                return compareStrings(
                  material.pathName,
                  parameter?.materialPath[0]
                );
              })
              ?.data?.find((item) => item?.valueId === valueIdIsDefault);

            options = optionsLvl1?.data || [];
            let x = options?.find(
              (item: any) =>
                item?.valueId === isDefaultObj?.materialValueIds[0]?.valueId
            );
            defailtObjectValue = x;
          }
        }
        if (parameter?.materialPath?.length == 1) {
          options = allMaterials?.find((material: any) => {
            return compareStrings(
              material?.pathName,
              parameter?.materialPath[0]
            );
          })?.data;
          let defaultOptionData = options?.find(
            (item: any) =>
              item?.valueId === isDefaultObj?.materialValueIds[0]?.valueId
          );
          defailtObjectValue = defaultOptionData;
        }
        return (
          <GoMakeAutoComplate
            options={options?.length > 0 ? options : []}
            placeholder={parameter.name}
            style={clasess.dropDownListStyle}
            defaultValue={defailtObjectValue}
            getOptionLabel={(option: any) => option.value}
            onChange={(e: any, value: any) => {
              if (parameter?.materialPath?.length == 3) {
                updatedParameterMaterialTypeValuesConfigsDefault(
                  sectionId,
                  subSectionId,
                  parameter,
                  value,
                  subSectionParameters,
                  3
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl3: value,
                  selectedOptionLvl3: value,
                });
              }
              if (parameter?.materialPath?.length == 2) {
                updatedParameterMaterialTypeValuesConfigsDefault(
                  sectionId,
                  subSectionId,
                  parameter,
                  value,
                  subSectionParameters,
                  2
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
                  value,
                  subSectionParameters,

                  1
                );
                setDigidatPriceData({
                  ...digitalPriceData,
                  selectedMaterialLvl1: value?.data,
                  selectedOptionLvl1: value,
                  selectedMaterialLvl2: null,
                  selectedMaterialLvl3: null,
                });
              }
            }}
            renderOption={(props: any, option: any) => {
              function checkValueIdAndHidden(valueId) {
                const matchedConfig = parameter?.valuesConfigs.find((config) =>
                  config.materialValueIds.some((id) => id.valueId === valueId)
                );

                return matchedConfig && matchedConfig.isHidden === true;
              }
              return (
                <div style={clasess.optionsContainer}>
                  <div {...props} style={{ width: "100%" }}>
                    {option.value}
                  </div>
                  <div>
                    {checkValueIdAndHidden(option.valueId) ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          updatedParameterMaterialTypeValuesConfigsHidden(
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
                          updatedParameterMaterialTypeValuesConfigsHidden(
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
    setTemplate,
    getProductById,
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
    expanded,
    handleChange,
  };
};

export { useAddProduct };
