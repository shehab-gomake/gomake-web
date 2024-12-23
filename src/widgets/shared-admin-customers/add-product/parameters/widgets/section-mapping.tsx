import { EParameterTypes } from "@/enums";
import {
  HiddenIcon,
  NotHiddenIcon,
  NotRequiredIcon,
  RequiredIcon,
  SettingIcon,
} from "../../icons";
import { Tooltip } from "@mui/material";
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
import { dontAskNextTimeState } from "@/store";
import { EditIcon } from "../../icons/edit-icon";

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
}) => {
  const { t } = useTranslation();
  const { alertFault } = useSnackBar();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [selectedActionType, setSelectedActionType] = useState(null);
  const [selectedUpdateType, setSelectedUpdateType] = useRecoilState(
    selectedUpdateTypeState
  );
  const [dontAskNextTime, setDontAskNextTime] =
    useRecoilState(dontAskNextTimeState);

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
    if (!dontAskNextTime) {
      setIsUpdateModalOpen(true);
    }
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

    debugger;
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
      <div style={classes.subSectionTitleStyle}>{subSection.name}</div>
      <div style={classes.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, paramIndex) => {
            // const isHiddenIcon = relatedParameters?.some(
            //   (relatedParam) => relatedParam.parameterId === parameter.id
            // );

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
                      <NotHiddenIcon />,
                      "hidden",
                      "visible",
                      () => {
                        if (!dontAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.VISIBLE,
                            parameter,
                            UpdateTypes.PRODUCT_ONLY
                          );
                        }
                        setSelectedActionType(ParameterActionType.VISIBLE);
                        setSelectedParameter(parameter);
                      }
                    )}
                    {parameter?.parameterType !== EParameterTypes.SWITCH &&
                      renderIconWithTooltip(
                        parameter?.isRequired,
                        <RequiredIcon />,
                        <NotRequiredIcon />,
                        "required",
                        "notRequired",
                        () => {
                          if (!dontAskNextTime) {
                            handleOpenModal();
                          } else {
                            handleUpdate(
                              ParameterActionType.REQUIRED,
                              parameter,
                              UpdateTypes.PRODUCT_ONLY
                            );
                          }
                          setSelectedActionType(ParameterActionType.REQUIRED);
                          setSelectedParameter(parameter);
                        }
                      )}
                    {renderIconWithTooltip(
                      parameter?.isLock,
                      <LockedIcon />,
                      <NotLockedIcon />,
                      "readOnly",
                      "editable",
                      () => {
                        if (!dontAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.EDITABLE,
                            parameter,
                            UpdateTypes.PRODUCT_ONLY
                          );
                        }
                        setSelectedActionType(ParameterActionType.EDITABLE);
                        setSelectedParameter(parameter);
                      }
                    )}
                    {renderIconWithTooltip(
                      parameter?.isShowToClient,
                      <DetailIcon />,
                      <NotDetailIcon />,
                      "shownInDetails",
                      "hiddenFromDetails",
                      () => {
                        if (!dontAskNextTime) {
                          handleOpenModal();
                        } else {
                          handleUpdate(
                            ParameterActionType.SHOW_IN_DETAILS,
                            parameter,
                            UpdateTypes.PRODUCT_ONLY
                          );
                        }
                        setSelectedActionType(
                          ParameterActionType.SHOW_IN_DETAILS
                        );
                        setSelectedParameter(parameter);
                      }
                    )}
                    {/* !here */}
                    {parameter?.parameterType ===
                      EParameterTypes.DROP_DOWN_LIST && (
                      <div
                        style={classes.plusIconStyle}
                        onClick={() =>
                          onOpenExternalIdsModal(
                            parameter,
                            section?.id,
                            subSection?.id
                          )
                        }
                      >
                        <EditIcon />
                      </div>
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
        onUpdate={() => handleUpdate(selectedActionType, selectedParameter)}
        setDontAskNextTime={setDontAskNextTime}
        dontAskNextTime={dontAskNextTime}
      />
    </div>
  );
};

export { SectionMappingWidget };
