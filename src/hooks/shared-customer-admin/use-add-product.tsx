import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
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
import { EButtonTypes, EParameterTypes } from "@/enums";
import cloneDeep from "lodash.clonedeep";
import {
  doNotAskNextTimeState,
  selectedUpdateTypeState,
  selectParameterButtonState,
} from "@/store";
import { ButtonParameterWidget } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/button-parameter";
import { findParameterByCode } from "@/utils/helpers";
import { SettingsIcon } from "@/icons/settings";
import { UpdateTypes } from "@/widgets/shared-admin-customers/add-product/parameters/widgets/section-mapping";
import { ESourceView, EUpdateActionType } from "@/enums/products";

const useAddProduct = ({ classes }) => {
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFault } = useSnackBar();
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
  const [GalleryModalOpen, setGalleryModalOpen] = useState(false);
  const setSelectParameterButton = useSetRecoilState(
    selectParameterButtonState
  );
  const straightKnife = findParameterByCode(productState, "IsStraightKnife");
  const [multiParameterModal, setMultiParameterModal] = useState(false);
  const [settingParameters, setSettingParameters] = useState({});

  const onCloseMultiParameterModal = () => {
    setMultiParameterModal(false);
  };

  const onOpeneMultiParameterModal = (
    paameters,
    subSection,
    section,
    subSectionParameters
  ) => {
    setMultiParameterModal(true);
    const value = paameters?.valuesConfigs?.find((value) => value?.isDefault);
    setSettingParameters({
      parameter: paameters,
      subSection: subSection,
      section: section,
      subSectionParameters: subSectionParameters,
      value: value,
    });
  };
  const onCloseGalleryModal = () => {
    setGalleryModalOpen(false);
  };
  const onOpeneGalleryModal = () => {
    setGalleryModalOpen(true);
  };
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
        sourceView: ESourceView.ProductEditView,
      });
      setProductState(data);
    }
  }, [router, template]);

  const [relatedParameters, setaRelatedParameters] = useState([]);

  useEffect(() => {
    const collectRelatedParameters = (template, result = []) => {
      if (template) {
        if (template?.relatedParameters) {
          result.push(...template.relatedParameters);
        }

        if (template?.sections) {
          for (const section of template?.sections) {
            collectRelatedParameters(section, result);
          }
        }

        if (template.subSections) {
          for (const subSection of template.subSections) {
            collectRelatedParameters(subSection, result);
          }
        }

        if (template.parameters) {
          for (const parameter of template.parameters) {
            collectRelatedParameters(parameter, result);
          }
        }

        return result;
      }
    };
    const allRelatedParameters = collectRelatedParameters(template);
    setaRelatedParameters(allRelatedParameters);
  }, [template]);

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
      alertSuccessAdded();
      getProductById();
    } else {
      alertFaultAdded();
    }
  };

  const removeProductParamete = useCallback(
    async (sectionId: string, subSectionId: string, parameter: any, updateType: UpdateTypes) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/remove-parameter-from-product`,
        {
          productId: router?.query?.id,
          sectionId: sectionId,
          subSectionId: subSectionId,
          parameterId: parameter?.id,
          updateType: updateType || 0
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        getProductById();
      } else {
        alertFaultAdded();
      }
    },
    [router]
  );

  const updatedProductParameterShowToClient = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      updateType: UpdateTypes
    ) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isShowToClient: !parameter?.isShowToClient,
        },
        updatedActionType: EUpdateActionType.showToClient,
        updateType,
      });
    },
    [router]
  );

  const updatedProductParameterHidden = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      updateType: UpdateTypes
    ) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isHidden: !parameter?.isHidden,
        },
        updatedActionType: EUpdateActionType.hidden,
        updateType,
      });
    },
    [router]
  );

  const updatedProductParameteRequierd = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      updateType: UpdateTypes
    ) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isRequired: !parameter?.isRequired,
        },
        updatedActionType: EUpdateActionType.required,
        updateType,
      });
    },
    [router]
  );

  const updatedProductParameteLocked = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      updateType: UpdateTypes
    ) => {
      await updateProductParameterEndPoint(sectionId, subSectionId, {
        parameter: {
          ...parameter,
          isLock: !parameter?.isLock,
        },
        updatedActionType: EUpdateActionType.lock,
        updateType,
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
            defaultValue: changeDefaultValue,
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
      option: any,
      updateType?: UpdateTypes
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
        updatedValueId: objectIdToUpdate,
        updatedActionType: EUpdateActionType.hiddenValue,
        updateType,
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
        if (!objectIdToUpdate) {
          // Case where the option is deleted and no new option is selected
          const updatedArray = temp.map((obj) => ({
            ...obj,
            isDefault: false,
          }));
          await updateProductParameterEndPoint(sectionId, subSectionId, {
            parameter: {
              ...parameter,
              valuesConfigs: updatedArray,
            },
          });
        } else {
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
            const updatedArray = temp
              .filter(
                (value) =>
                  !(
                    value?.materialValueIds?.length === 1 &&
                    value?.materialValueIds[0]?.path === null &&
                    value?.materialValueIds[0]?.valueId === null
                  )
              )
              .map((obj) => {
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
      }
    },
    [router]
  );

  const updatedParameterMaterialTypeValuesConfigsHidden = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      parameter: any,
      option: any,
      updateType?: UpdateTypes
    ) => {
      let temp = [...parameter?.valuesConfigs];
      if (temp?.length <= 0) {
        const newId = uuidv4();
        temp.push({
          id: newId,
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
        await updatedValuesConfigsForParameters(
          sectionId,
          subSectionId,
          {
            ...parameter,
            valuesConfigs: temp,
          },
          newId,
          EUpdateActionType.hiddenValue,
          updateType
        );
      } else {
        let objectIdToUpdate = option?.valueId;
        const matchingItem = temp.find(
          (item) => item?.materialValueIds[0]?.valueId === objectIdToUpdate
        );

        if (matchingItem) {
          const idToSend = matchingItem?.id;

          const updatedArray = temp.map((obj) => {
            if (obj?.materialValueIds[0]?.valueId === objectIdToUpdate) {
              return { ...obj, isHidden: !obj.isHidden };
            }
            return obj;
          });

          await updatedValuesConfigsForParameters(
            sectionId,
            subSectionId,
            {
              ...parameter,
              valuesConfigs: updatedArray,
            },
            idToSend,
            EUpdateActionType.hiddenValue,
            updateType
          );
        } else {
          const newId = uuidv4();
          temp.push({
            id: newId,
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
          await updatedValuesConfigsForParameters(
            sectionId,
            subSectionId,
            {
              ...parameter,
              valuesConfigs: temp,
            },
            newId,
            EUpdateActionType.hiddenValue,
            updateType
          );
        }
      }
    },
    [router]
  );

  const updatedValuesConfigsForParameters = useCallback(
    async (
      sectionId: string,
      subSectionId: string,
      data: any,
      updatedValueId?: string,
      updatedActionType?: EUpdateActionType,
      updateType?: UpdateTypes
    ) => {
      const res = await callApi(
        "PUT",
        `/v1/printhouse-config/products/update-product-parameter`,
        {
          productId: router?.query?.id,
          sectionId: sectionId,
          subSectionId: subSectionId,
          productParameterType: 1,
          parameter: data,
          updatedValueId,
          updatedActionType,
          updateType,
        }
      );
      if (res?.success) {
        alertSuccessAdded();
        getProductById();
      } else {
        alertFaultAdded();
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

  const [openExternalIdsModal, setOpenExternalIdsModal] = useState(false);

  const onOpenExternalIdsModal = (
    parameter,
    subSectionParameters,
    sectionId,
    subSectionId
  ) => {
    if (!parameter?.productParametersExternalValues) {
      parameter.productParametersExternalValues = []
    }
    //Check if parameterType is material
    const isMaterial =
      parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
      parameter?.parameterType ===
      EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
      parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_NAME;
    const isSwitch = parameter?.parameterType === EParameterTypes.SWITCH;
    const isInput = parameter?.parameterType === EParameterTypes.INPUT_TEXT || parameter?.parameterType === EParameterTypes.INPUT_NUMBER;
    // Creating new valuesConfigs for materials
    let materialsOptions = [];
    const materialPath = parameter.materialPath;
    const currentMaterialPath = materialPath[materialPath.length - 1];
    const parentMaterialPath = materialPath.slice(0, -1);
    let allMaterialsCopy = cloneDeep(allMaterials);

    if (isMaterial) {
      if (parentMaterialPath && parentMaterialPath.length > 0) {
        allMaterialsCopy = allMaterialsCopy?.find((material) =>
          compareStrings(material.pathName, parentMaterialPath[0])
        );
        for (let i = 0; i < parentMaterialPath.length; i++) {
          const currentPath = parentMaterialPath.slice(0, i + 1).toString();
          const parentParameter = subSectionParameters.find(
            (x) => x.materialPath && x.materialPath.toString() == currentPath
          );
          if (parentParameter) {
            const parentParameterDefaultValueConfig =
              parentParameter?.valuesConfigs?.find(
                (item) => item.isDefault === true
              );
            if (parentParameterDefaultValueConfig) {
              const parentParameterValue =
                parentParameterDefaultValueConfig.materialValueIds[0].valueId;
              allMaterialsCopy = allMaterialsCopy?.data.find(
                (x) => x.valueId === parentParameterValue
              );
            } else {
              allMaterialsCopy = {
                data: [],
              };
            }
          }
        }
        if (allMaterialsCopy) {
          materialsOptions = [];
          materialsOptions.push(...allMaterialsCopy.data);
        }
      } else {
        allMaterialsCopy = allMaterialsCopy?.find((material) =>
          compareStrings(material.pathName, currentMaterialPath)
        );
        if (
          allMaterialsCopy &&
          allMaterialsCopy.data &&
          allMaterialsCopy.data.length > 0
        ) {
          materialsOptions.push(...allMaterialsCopy?.data);
        }
      }
    }

    if (!isSwitch) {
      if (
        (isMaterial && materialsOptions?.length === 0) ||
        (!isMaterial &&
          (!parameter?.valuesConfigs || parameter?.valuesConfigs.length === 0))
      ) {
        //alertFault("alerts.noValues");
        ///return;
      }
    }

    //Extract externalCode for the materials/switch that come from productParametersExternalValues
    if (isMaterial || isSwitch || isInput) {
      let valuesConfigs = [];
      if (parameter?.productParametersExternalValues) {
        const externalValuesMap = new Map(
          parameter.productParametersExternalValues.map((ev) => [
            ev.valueId,
            ev.externalCode,
          ])
        );

        if (isMaterial) {
          valuesConfigs = materialsOptions.map((materialOption) => ({
            ...materialOption,
            externalValue:
              externalValuesMap.get(materialOption.valueId) || null,
          }));
        } else if (isSwitch) {
          valuesConfigs = [
            {
              value: t("products.parameters.true"),
              valueId: "true",
              externalValue: externalValuesMap.get("true") || null,
            },
            {
              value: t("products.parameters.false"),
              valueId: "false",
              externalValue: externalValuesMap.get("false") || null,
            },
          ];
        } else {
          valuesConfigs = parameter?.productParametersExternalValues.map((x) => ({
            updateName: x.valueId,
            externalValue: x.externalCode
          }));
        }
      }
      // Set the parameter with updated valuesConfigs
      const updatedParameter = {
        ...parameter,
        valuesConfigs,
      };
      setSelectedParameter(updatedParameter);
    } else {
      setSelectedParameter(parameter);
    }
    setSelectedSectonId(sectionId);
    setSelectedSubSection(subSectionId);

    setTimeout(() => {
      setOpenExternalIdsModal(true);
    }, 100);
  };

  const onCloseExternalIdsModal = () => {
    setSelectedParameter({});
    setOpenExternalIdsModal(false);
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [selectedSectionId, setSelectedSectionId] = useState<any>({});
  const [selectedSubSectionId, setSelectedSubSectionId] = useState<any>({});
  const [selectedUpdateType, setSelectedUpdateType] = useRecoilState(
    selectedUpdateTypeState
  );
  const [doNotAskNextTime, setDoNotAskNextTime] = useRecoilState(
    doNotAskNextTimeState
  );

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    // setSelectedUpdateType(null);
    setSelectedOption(null);
    setSelectedSectionId(null);
    setSelectedSubSectionId(null);
  };

  const handleOpenModal = () => {
    if (!doNotAskNextTime) {
      setIsUpdateModalOpen(true);
    }
  };

  const [isMaterialParameter, setIsMaterialParameter] =
    useState<boolean>(false);
  const handleUpdateParametersValue = (
    isMaterial: boolean,
    sectionId: string,
    subSectionId: string,
    parameter: any,
    option: any,
    updateType?: UpdateTypes
  ) => {
    if (selectedUpdateType === null) {
      alertFault(t("products.parameters.pleaseSelectOneOption"));
      return;
    }
    if (isMaterial)
      updatedParameterMaterialTypeValuesConfigsHidden(
        sectionId,
        subSectionId,
        parameter,
        option,
        updateType === 0 ? updateType : selectedUpdateType
      );
    else
      updatedProductParameterValuesConfigsHidden(
        sectionId,
        subSectionId,
        parameter,
        option,
        updateType === 0 ? updateType : selectedUpdateType
      );

    handleCloseModal();
  };

  const _renderParameterType = (
    sectionId,
    subSectionId,
    parameter,
    subSectionParameters,
    index,
    section,
    subSection
  ) => {
    if (parameter?.parameterType === EParameterTypes.INPUT_NUMBER) {
      return (
        <GomakeTextInput
          style={classes.textInputStyle}
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
          disabled={parameter?.isHidden}
        />
      );
    } else if (parameter?.parameterType === EParameterTypes.INPUT_TEXT) {
      return (
        <GomakeTextInput
          style={classes.textInputStyle}
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
          disabled={parameter?.isHidden}
        />
      );
    } else if (
      parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
      parameter?.parameterType === EParameterTypes.MACHINES_SELECT
    ) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "8px",
          }}
        >
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs}
            disabled={parameter?.isHidden}
            placeholder={parameter.name}
            style={classes.dropDownListStyle}
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
                <div style={classes.optionsContainer}>
                  <div
                    {...props}
                    style={{ width: "100%", alignSelf: "center", marginTop: 5 }}
                  >
                    {option.updateName}
                  </div>
                  <div>
                    {option.isHidden ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(false);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              false,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
                      >
                        <HiddenIcon />
                      </div>
                    ) : (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(false);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              false,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
                      >
                        <NotHiddenIcon />
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
          {parameter?.setSettingIcon && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                onOpeneMultiParameterModal(
                  parameter,
                  subSection,
                  section,
                  subSectionParameters
                );
              }}
            >
              <SettingsIcon
                stroke={"rgba(237, 2, 140, 1)"}
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
      );
    } else if (parameter?.parameterType === EParameterTypes.SWITCH) {
      return (
        <SecondSwitch
          disabled={parameter?.isHidden}
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
          disabled={parameter?.isHidden}
          placeholder={parameter.name}
          style={classes.dropDownListStyle}
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
              <div style={classes.optionsContainer}>
                <div {...props} style={{ width: "100%" }}>
                  {option.updateName}
                </div>
                <div>
                  {option.isHidden ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsMaterialParameter(false);
                        setSelectedSectionId(sectionId);
                        setSelectedSubSectionId(subSectionId);
                        setSelectedParameter(parameter);
                        setSelectedOption(option);
                        if (!doNotAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdateParametersValue(
                            false,
                            sectionId,
                            subSectionId,
                            parameter,
                            option,
                            selectedUpdateType
                          );
                        }
                      }}
                    >
                      <HiddenIcon />
                    </div>
                  ) : (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsMaterialParameter(false);
                        setSelectedSectionId(sectionId);
                        setSelectedSubSectionId(subSectionId);
                        setSelectedParameter(parameter);
                        setSelectedOption(option);
                        if (!doNotAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdateParametersValue(
                            false,
                            sectionId,
                            subSectionId,
                            parameter,
                            option,
                            selectedUpdateType
                          );
                        }
                      }}
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
    else if (
      parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
      parameter?.parameterType ===
      EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
      parameter?.parameterType === EParameterTypes.ADVERTISING_PRODUCT_NAME

    ) {
      if (allMaterials?.length > 0) {
        const defailtObjectValue = parameter?.valuesConfigs?.find(
          (item) => item.isDefault === true
        );
        let options = [];
        let selectedOption;
        const materialPath = parameter.materialPath;
        const currentMaterialPath = materialPath[materialPath.length - 1];
        const parentMaterialPath = materialPath.slice(0, -1);
        let allMaterialsCopy = cloneDeep(allMaterials);
        if (parentMaterialPath && parentMaterialPath.length > 0) {
          allMaterialsCopy = allMaterialsCopy?.find((material) =>
            compareStrings(material.pathName, parentMaterialPath[0])
          );
          for (let i = 0; i < parentMaterialPath.length; i++) {
            const currentPath = parentMaterialPath.slice(0, i + 1).toString();
            const parentParameter = subSectionParameters.find(
              (x) => x.materialPath && x.materialPath.toString() == currentPath
            );
            if (parentParameter) {
              /*allMaterialsCopy = allMaterialsCopy?.data?.find(material =>
                  compareStrings(material.pathName, parentMaterialPath[i])
              )?.data;*/
              const parentParameterDefaultValueConfig =
                parentParameter?.valuesConfigs?.find(
                  (item) => item.isDefault === true
                );
              if (parentParameterDefaultValueConfig) {
                const parentParameterValue =
                  parentParameterDefaultValueConfig.materialValueIds[0].valueId;
                allMaterialsCopy = allMaterialsCopy?.data.find(
                  (x) => x.valueId === parentParameterValue
                );
              } else {
                allMaterialsCopy = {
                  data: [],
                };
              }
            }
          }
          if (allMaterialsCopy) {
            options = [];
            options.push(...allMaterialsCopy.data);
          }
        } else {
          allMaterialsCopy = allMaterialsCopy?.find((material) =>
            compareStrings(material.pathName, currentMaterialPath)
          );
          if (
            allMaterialsCopy &&
            allMaterialsCopy.data &&
            allMaterialsCopy.data.length > 0
          ) {
            options.push(...allMaterialsCopy?.data);
          }
        }
        if (defailtObjectValue) {
          selectedOption = options.find(
            (option) =>
              option.valueId ===
              defailtObjectValue?.materialValueIds[0]?.valueId
          );
        }
        return (
          <GoMakeAutoComplate
            options={options?.length > 0 ? options : []}
            disabled={parameter?.isHidden}
            placeholder={parameter.name}
            style={classes.dropDownListStyle}
            defaultValue={selectedOption}
            getOptionLabel={(option: any) => option.value}
            onChange={(e: any, value: any) => {
              updatedParameterMaterialTypeValuesConfigsDefault(
                sectionId,
                subSectionId,
                parameter,
                value
              );
            }}
            renderOption={(props: any, option: any) => {
              function checkValueIdAndHidden(valueId) {
                const matchedConfig = parameter?.valuesConfigs.find((config) =>
                  config.materialValueIds.some((id) => id.valueId === valueId)
                );
                return matchedConfig && matchedConfig.isHidden === true;
              }

              return (
                <div style={classes.optionsContainer}>
                  <div {...props} style={{ width: "100%" }}>
                    {option?.value}
                  </div>
                  <div>
                    {checkValueIdAndHidden(option?.valueId) ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(true);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              true,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
                      >
                        <HiddenIcon />
                      </div>
                    ) : (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(true);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              true,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
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

    else if (parameter?.parameterType === EParameterTypes.SELECT_FIXED_VALUES_WITH_IMAGES) {
      const defaultObject = parameter.valuesConfigs.find(
        (item) => item.isDefault === true
      );
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            gap: "8px",
          }}
        >
          <GoMakeAutoComplate
            options={parameter?.valuesConfigs}
            disabled={parameter?.isHidden}
            placeholder={parameter.name}
            style={classes.dropDownListStyle}
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
                <div style={classes.optionsContainer}>
                  <div
                    {...props}
                    style={{ width: "100%", alignSelf: "center", marginTop: 5 }}
                  >
                    {option?.imageUrl && <img
                      src={option?.imageUrl}
                      alt={option.updateName}
                      style={{ width: '40px', height: '40px', margin: '10px', objectFit: "cover" }}
                    />}
                    {option.updateName}
                  </div>
                  <div>
                    {option.isHidden ? (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(false);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              false,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
                      >
                        <HiddenIcon />
                      </div>
                    ) : (
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMaterialParameter(false);
                          setSelectedSectionId(sectionId);
                          setSelectedSubSectionId(subSectionId);
                          setSelectedParameter(parameter);
                          setSelectedOption(option);
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdateParametersValue(
                              false,
                              sectionId,
                              subSectionId,
                              parameter,
                              option,
                              selectedUpdateType
                            );
                          }
                        }}
                      >
                        <NotHiddenIcon />
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
          {parameter?.setSettingIcon && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                onOpeneMultiParameterModal(
                  parameter,
                  subSection,
                  section,
                  subSectionParameters
                );
              }}
            >
              <SettingsIcon
                stroke={"rgba(237, 2, 140, 1)"}
                width={24}
                height={24}
              />
            </div>
          )}
        </div>
      )
    }
    else if (parameter?.parameterType === EParameterTypes.BUTTON) {
      return (
        <ButtonParameterWidget
          classes={classes}
          parameter={parameter}
          selectBtnTypeToAction={selectBtnTypeToAction}
          subSection={subSection}
          section={section}
          index={index}
          straightKnife={straightKnife}
          isParameterSettings={true}
          allMaterials={allMaterials}
          template={template}
          getProductById={getProductById}
        />
      );
    }
  };

  const selectBtnTypeToAction = (
    parameter,
    sectionId,
    subSectionId,
    index,
    paameterType
  ) => {
    if (parameter?.buttonAction === EButtonTypes.GALLERY_MODAL) {
      setSelectParameterButton({
        parameter,
        sectionId,
        subSectionId,
        index,
        paameterType,
      });
      onOpeneGalleryModal();
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
    updatedProductParameterShowToClient,
    updatedProductParameteRequierd,
    updatedProductParameteLocked,
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
    selectedParameter,
    openModal,
    expanded,
    handleChange,
    relatedParameters,
    GalleryModalOpen,
    onCloseGalleryModal,
    onOpeneGalleryModal,
    straightKnife,
    multiParameterModal,
    onCloseMultiParameterModal,
    onOpeneMultiParameterModal,
    settingParameters,
    setSettingParameters,
    setSelectedUpdateType,
    selectedUpdateType,
    handleCloseModal,
    isUpdateModalOpen,
    handleUpdateParametersValue,
    setDoNotAskNextTime,
    doNotAskNextTime,
    isMaterialParameter,
    selectedSectonId,
    selectedOption,
    selectedSubSectionId,
    selectedSectionId,
    onOpenExternalIdsModal,
    onCloseExternalIdsModal,
    openExternalIdsModal,
    removeProductParamete,
  };
};

export { useAddProduct };
