import { EParameterTypes, ModalType } from "@/enums";
import {
  HiddenIcon,
  NotHiddenIcon,
  NotRequiredIcon,
  RequiredIcon,
  SettingIcon,
} from "../../icons";
import { IconButton, Tooltip } from "@mui/material";
import { LockedIcon } from "../../icons/lock-icon";
import { NotLockedIcon } from "../../icons/not-lock-icon";
import { DetailIcon } from "../../icons/detail-icon";
import { NotDetailIcon } from "../../icons/not-detail-icon";
import { useTranslation } from "react-i18next";
import { UpdateParameterModal } from "./update-parameter-modal";
import { useState } from "react";
import { useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { selectedUpdateTypeState } from "@/store/selected-update-type";
import { doNotAskNextTimeState } from "@/store";
import { EditIcon } from "../../icons/edit-icon";
import { GoMakeDeleteModal, SecondSwitch } from "@/components";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/router";
import { AddNewParameterModal } from "./add-new-parameter-modal";
import { DeleteIcon } from "@/widgets/settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useModal } from "@/hooks/use-modal";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export enum UpdateTypes {
  PRODUCT_ONLY = 0,
  SAME_PRICING_TYPE,
  ALL_PRODUCTS,
}

enum ParameterActionType {
  VISIBLE = "VISIBLE",
  REQUIRED = "REQUIRED",
  EDITABLE = "EDITABLE",
  SHOW_IN_DETAILS = "SHOW_IN_DETAILS",
}

const SectionMappingWidget = ({
  index,
  classes,
  subSection,
  onOpenModal,
  onOpenExternalIdsModal,
  section,
  updatedProductParameterHidden,
  updatedProductParameteRequierd,
  _renderParameterType,
  relatedParameters,
  updatedProductParameteLocked,
  updatedProductParameterShowToClient,
  getProductById,
  removeProductParamete,
}) => {
  const { t } = useTranslation();
  const { alertFault, alertWarning } = useSnackBar();
  const { secondColor } = useGomakeTheme();
  const router = useRouter();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [selectedUpdateType, setSelectedUpdateType] = useRecoilState(
    selectedUpdateTypeState
  );
  const { isOpen, open: openModal, close: closeModal } = useModal();
  const [doNotAskNextTime, setDoNotAskNextTime] = useRecoilState(
    doNotAskNextTimeState
  );
  const [isAddNewParameterModalOpen, setIsAddNewParameterModalOpen] =
    useState(false);
  const handleCloseAddNewParameterModal = () => {
    setIsAddNewParameterModalOpen(false);
  };
  const handleOpenAddNewParameterModal = () => {
    setIsAddNewParameterModalOpen(true);
  };
  const [newParameterState, setNewParameterState] = useState({
    parameterName: "",
    parameterType: 0,
    productId: "",
    sectionId: "",
    subSectionId: "",
    updateType: 0,
  });

  const onChangeInputs = (key: string, value: any) => {
    setNewParameterState({ ...newParameterState, [key]: value });
  };

  const renderIconWithTooltip = (
    condition,
    trueIcon,
    falseIcon,
    trueTitle,
    falseTitle,
    onClickHandler
  ) => (
    <Tooltip
      title={
        condition ? t(`tooltips.${trueTitle}`) : t(`tooltips.${falseTitle}`)
      }
      placement="top"
    >
      <div style={{ cursor: "pointer" }} onClick={onClickHandler}>
        {condition ? trueIcon : falseIcon}
      </div>
    </Tooltip>
  );

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    // setSelectedUpdateType(null);
  };

  const handleOpenModal = () => {
    if (!doNotAskNextTime) {
      setIsUpdateModalOpen(true);
    }
  };

  const hasDefaultValue = (parameter) => {
    // Check for DROP_DOWN_LIST, SELECT_MATERIALS, or other specific types
    if (
      parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
      parameter?.parameterType === EParameterTypes.SELECT_MATERIALS
    ) {
      // Check valuesConfigs for default value
      return parameter?.valuesConfigs?.some(
        (config) => config.isDefault === true
      );
    }
    // For other parameter types, check defaultValue
    return !!parameter?.defaultValue;
  };

  const canUpdateVisibility = (parameter) => {
    if (!parameter?.defaulValueIsRequiredBeforeHide) {
      return true;
    }
    return hasDefaultValue(parameter);
  };

  const handleUpdate = (
    actionType: ParameterActionType,
    parameter: any,
    updateType?: UpdateTypes
  ) => {
    if (selectedUpdateType === null) {
      alertFault(t("products.parameters.pleaseSelectOneOption"));
      return;
    }
    switch (actionType) {
      case ParameterActionType.VISIBLE:
        updatedProductParameterHidden(
          section?.id,
          subSection?.id,
          parameter,
          updateType === 0 ? updateType : selectedUpdateType
        );
        break;
      case ParameterActionType.REQUIRED:
        updatedProductParameteRequierd(
          section?.id,
          subSection?.id,
          parameter,
          updateType === 0 ? updateType : selectedUpdateType
        );
        break;
      case ParameterActionType.EDITABLE:
        updatedProductParameteLocked(
          section?.id,
          subSection?.id,
          parameter,
          updateType === 0 ? updateType : selectedUpdateType
        );
        break;
      case ParameterActionType.SHOW_IN_DETAILS:
        updatedProductParameterShowToClient(
          section?.id,
          subSection?.id,
          parameter,
          updateType === 0 ? updateType : selectedUpdateType
        );
        break;
      default:
        break;
    }
    handleCloseModal();
  };

  return (
    <div key={index} style={classes.subSectionContainer}>
      {doNotAskNextTime && index === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            {t("products.parameters.samePricingType")}
          </div>
          <SecondSwitch
            defaultChecked={
              selectedUpdateType === UpdateTypes.SAME_PRICING_TYPE
            }
            checked={selectedUpdateType === UpdateTypes.SAME_PRICING_TYPE}
            onChange={(e: any, value: any) => {
              setSelectedUpdateType(
                value ? UpdateTypes.SAME_PRICING_TYPE : UpdateTypes.PRODUCT_ONLY
              );
            }}
            key={selectedUpdateType}
          />
        </div>
      )}
      <div style={classes.subSectionTitleStyle}>
        {subSection.name}
        <Tooltip title={"Add New Parameter"} placement="top">
          <IconButton
            onClick={() => {
              handleOpenAddNewParameterModal();
              setNewParameterState({
                productId: router?.query?.id as string,
                sectionId: section?.id,
                subSectionId: subSection?.id,
                updateType: 0,
                parameterName: "",
                parameterType: 0,
              });
            }}
          >
            <PlusIcon
              stroke={`var(--theme-accent-color, ${secondColor(500)})`}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div style={classes.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, paramIndex) => {
            const ShowEditExternalCodeValue =
              parameter?.parameterType ===
                EParameterTypes.SELECT_CHILDS_PARAMETERS ||
              parameter?.parameterType === EParameterTypes.SELECT_MATERIALS ||
              parameter?.parameterType === EParameterTypes.DROP_DOWN_LIST ||
              parameter?.parameterType ===
                EParameterTypes.ADVERTISING_PRODUCT_CATEGORY ||
              parameter?.parameterType ===
                EParameterTypes.ADVERTISING_PRODUCT_NAME ||
              parameter?.parameterType === EParameterTypes.SWITCH;
            return (
              <div key={paramIndex}>
                <div style={classes.parameterContainer}>
                  <div style={classes.parameterLabelStyle}>
                    <div style={classes.paramNameStyle}>
                      {parameter?.name}
                      <small>&nbsp;{parameter?.defaultUnit}</small>
                    </div>
                    {parameter?.parameterType ===
                      EParameterTypes.SELECT_CHILDS_PARAMETERS && (
                      <div
                        style={classes.plusIconStyle}
                        onClick={() =>
                          onOpenModal(parameter, section?.id, subSection?.id)
                        }
                      >
                        <SettingIcon width={20} height={20} />
                      </div>
                    )}
                    {renderIconWithTooltip(
                      parameter?.isHidden,
                      <HiddenIcon />,
                      <NotHiddenIcon
                        stroke={`var(--theme-accent-color, ${secondColor(
                          500
                        )})`}
                      />,
                      "hidden",
                      "visible",
                      () => {
                        if (parameter?.defaulValueIsRequiredBeforeHide) {
                          if (!canUpdateVisibility(parameter)) {
                            alertWarning("products.parameters.setDefaultValue");
                            return;
                          }
                        }
                        if (!doNotAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.VISIBLE,
                            parameter,
                            selectedUpdateType
                          );
                        }
                        setSelectedActionType(ParameterActionType.VISIBLE);
                        setSelectedParameter(parameter);
                      }
                    )}
                    {parameter?.parameterType !== EParameterTypes.SWITCH &&
                      renderIconWithTooltip(
                        parameter?.isRequired,
                        <RequiredIcon
                          stroke={`var(--theme-accent-color, ${secondColor(
                            500
                          )})`}
                        />,
                        <NotRequiredIcon />,
                        "required",
                        "notRequired",
                        () => {
                          if (parameter?.isRequiredInTemplate) {
                            alertWarning(
                              "products.parameters.isRequiredInTemplate"
                            );
                            return;
                          }
                          if (!doNotAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdate(
                              ParameterActionType.REQUIRED,
                              parameter,
                              selectedUpdateType
                            );
                          }
                          setSelectedActionType(ParameterActionType.REQUIRED);
                          setSelectedParameter(parameter);
                        }
                      )}
                    {renderIconWithTooltip(
                      parameter?.isLock,
                      <LockedIcon />,
                      <NotLockedIcon
                        stroke={`var(--theme-accent-color, ${secondColor(
                          500
                        )})`}
                      />,
                      "readOnly",
                      "editable",
                      () => {
                        if (!doNotAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.EDITABLE,
                            parameter,
                            selectedUpdateType
                          );
                        }
                        setSelectedActionType(ParameterActionType.EDITABLE);
                        setSelectedParameter(parameter);
                      }
                    )}
                    {renderIconWithTooltip(
                      parameter?.isShowToClient,
                      <DetailIcon
                        stroke={`var(--theme-accent-color, ${secondColor(
                          500
                        )})`}
                      />,
                      <NotDetailIcon />,
                      "shownInDetails",
                      "hiddenFromDetails",
                      () => {
                        if (!doNotAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.SHOW_IN_DETAILS,
                            parameter,
                            selectedUpdateType
                          );
                        }
                        setSelectedActionType(
                          ParameterActionType.SHOW_IN_DETAILS
                        );
                        setSelectedParameter(parameter);
                      }
                    )}
                    <div
                      style={classes.plusIconStyle}
                      onClick={() =>
                        onOpenExternalIdsModal(
                          parameter,
                          subSection?.parameters,
                          section?.id,
                          subSection?.id
                        )
                      }
                    >
                      <EditIcon
                        stroke={`var(--theme-accent-color, ${secondColor(
                          500
                        )})`}
                      />
                    </div>
                    {parameter?.isDeletable && (
                      <Tooltip title={t("modal.delete")} placement="top">
                        <div
                          style={classes.plusIconStyle}
                          onClick={() => {
                            setSelectedParameter(parameter);
                            openModal();
                          }}
                        >
                          <DeleteIcon
                            stroke={`var(--theme-accent-color, ${secondColor(
                              500
                            )})`}
                            width={20}
                            height={20}
                          />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <div style={classes.renderParameterTypeContainer}>
                    {_renderParameterType(
                      section?.id,
                      subSection?.id,
                      parameter,
                      subSection?.parameters,
                      paramIndex,
                      section,
                      subSection
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <UpdateParameterModal
        openModal={isUpdateModalOpen}
        onClose={handleCloseModal}
        selectedUpdateType={selectedUpdateType}
        setSelectedUpdateType={setSelectedUpdateType}
        onUpdate={() =>
          handleUpdate(
            selectedActionType,
            selectedParameter,
            selectedUpdateType
          )
        }
        setDoNotAskNextTime={setDoNotAskNextTime}
        doNotAskNextTime={doNotAskNextTime}
      />
      <AddNewParameterModal
        openModal={isAddNewParameterModalOpen}
        onClose={handleCloseAddNewParameterModal}
        newParameterState={newParameterState}
        onChangeInputs={onChangeInputs}
        getProductById={getProductById}
      />
      <GoMakeDeleteModal
        modalType={ModalType.DELETE}
        openModal={isOpen}
        onClose={closeModal}
        onClickDelete={() =>
          removeProductParamete(
            section?.id,
            subSection?.id,
            selectedParameter,
            selectedUpdateType
          )
        }
      />
    </div>
  );
};

export { SectionMappingWidget };
