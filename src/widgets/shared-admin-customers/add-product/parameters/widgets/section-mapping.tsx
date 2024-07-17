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
  updatedProductParameterShowToClient
}) => {
  const { t } = useTranslation();
  const renderIconWithTooltip = (condition, trueIcon, falseIcon, trueTitle, falseTitle, onClickHandler) => (
    <Tooltip title={condition ? t(`tooltips.${trueTitle}`) : t(`tooltips.${falseTitle}`)} placement="top">
      <div style={{ cursor: "pointer" }} onClick={onClickHandler}>
        {condition ? trueIcon : falseIcon}
      </div>
    </Tooltip>
  );

  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, paramIndex) => {

            const isHiddenIcon = relatedParameters?.some(
              (relatedParam) => relatedParam.parameterId === parameter.id
            );

            return (
              <div key={paramIndex}>
                <div style={clasess.parameterContainer}>
                  <div style={clasess.parameterLabelStyle}>
                    <div style={clasess.paramNameStyle}>
                      {parameter?.name} <small>&nbsp;{parameter?.defaultUnit}</small>
                    </div>
                    {parameter?.parameterType === EParameterTypes.SELECT_CHILDS_PARAMETERS && (
                      <div
                        style={clasess.plusIconStyle}
                        onClick={() =>
                          onOpenModal(parameter, section?.id, subSection?.id)
                        }
                      >
                        <SettingIcon width={20} height={20} />
                      </div>
                    )}

                    {!isHiddenIcon && (
                      renderIconWithTooltip(
                        parameter?.isHidden,
                        <HiddenIcon />,
                        <NotHiddenIcon />,
                        "hidden",
                        "visible",
                        () => updatedProductParameterHidden(section?.id, subSection?.id, parameter)
                      )
                    )}

                    {parameter?.parameterType !== EParameterTypes.SWITCH && (
                      renderIconWithTooltip(
                        parameter?.isRequired,
                        <RequiredIcon />,
                        <NotRequiredIcon />,
                        "required",
                        "notRequired",
                        () => updatedProductParameteRequierd(section?.id, subSection?.id, parameter)
                      )
                    )}

                    {renderIconWithTooltip(
                      parameter?.isLock,
                      <LockedIcon />,
                      <NotLockedIcon />,
                      "readOnly",
                      "editable",
                      () => updatedProductParameteLocked(section?.id, subSection?.id, parameter)
                    )}

                    {renderIconWithTooltip(
                      parameter?.isShowToClient,
                      <DetailIcon />,
                      <NotDetailIcon />,
                      "shownInDetails",
                      "hiddenFromDetails",
                      () => updatedProductParameterShowToClient(section?.id, subSection?.id, parameter)
                    )}
                  </div>
                  <div style={clasess.renderParameterTypeContainer}>
                    {_renderParameterType(
                      section?.id,
                      subSection?.id,
                      parameter,
                      subSection?.parameters,
                      paramIndex
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { SectionMappingWidget };