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
  clasess,
  subSection,
  onOpenModal,
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
  const [selectedUpdateType, setSelectedUpdateType] =
    useState<UpdateTypes | null>(null);

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
    setSelectedUpdateType(null);
  };

  const handleOpenModal = () => {
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = () => {
    if (selectedUpdateType === null) {
      alertFault(t("products.parameters.pleaseSelectOneOption"));
      return;
    }

    switch (selectedActionType) {
      case ParameterActionType.VISIBLE:
        updatedProductParameterHidden(
          section?.id,
          subSection?.id,
          selectedParameter,
          selectedUpdateType
        );
        break;
      case ParameterActionType.REQUIRED:
        updatedProductParameteRequierd(
          section?.id,
          subSection?.id,
          selectedParameter,
          selectedUpdateType
        );
        break;
      case ParameterActionType.EDITABLE:
        updatedProductParameteLocked(
          section?.id,
          subSection?.id,
          selectedParameter,
          selectedUpdateType
        );
        break;
      case ParameterActionType.SHOW_IN_DETAILS:
        updatedProductParameterShowToClient(
          section?.id,
          subSection?.id,
          selectedParameter,
          selectedUpdateType,
          selectedUpdateType
        );
        break;
      default:
        break;
    }
    handleCloseModal();
  };

  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, paramIndex) => {

            // const isHiddenIcon = relatedParameters?.some(
            //   (relatedParam) => relatedParam.parameterId === parameter.id
            // );

            return (
              <div key={paramIndex}>
                <div style={clasess.parameterContainer}>
                  <div style={clasess.parameterLabelStyle}>
                    <div style={clasess.paramNameStyle}>
                      {parameter?.name}{" "}
                      <small>&nbsp;{parameter?.defaultUnit}</small>
                    </div>
                    {parameter?.parameterType ===
                      EParameterTypes.SELECT_CHILDS_PARAMETERS && (
                      <div
                        style={clasess.plusIconStyle}
                        onClick={() =>
                          onOpenModal(parameter, section?.id, subSection?.id)
                        }
                      >
                        <SettingIcon width={20} height={20} />
                      </div>
                    )}

                    {(
                      renderIconWithTooltip(
                        parameter?.isHidden,
                        <HiddenIcon />,
                        <NotHiddenIcon />,
                        "hidden",
                        "visible",
                        () => {
                          setSelectedActionType(ParameterActionType.VISIBLE);
                          setSelectedParameter(parameter);
                          handleOpenModal();
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
                          setSelectedActionType(ParameterActionType.REQUIRED);
                          setSelectedParameter(parameter);
                          handleOpenModal();
                        }
                      )}
                    {renderIconWithTooltip(
                      parameter?.isLock,
                      <LockedIcon />,
                      <NotLockedIcon />,
                      "readOnly",
                      "editable",
                      () => {
                        setSelectedActionType(ParameterActionType.EDITABLE);
                        setSelectedParameter(parameter);
                        handleOpenModal();
                      }
                    )}
                    {renderIconWithTooltip(
                      parameter?.isShowToClient,
                      <DetailIcon />,
                      <NotDetailIcon />,
                      "shownInDetails",
                      "hiddenFromDetails",
                      () => {
                        setSelectedActionType(
                          ParameterActionType.SHOW_IN_DETAILS
                        );
                        setSelectedParameter(parameter);
                        handleOpenModal();
                      }
                    )}
                  </div>
                  <div style={clasess.renderParameterTypeContainer}>
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
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export { SectionMappingWidget };
