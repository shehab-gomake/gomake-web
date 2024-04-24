import { EParameterTypes } from "@/enums";
import {
  HiddenIcon,
  NotHiddenIcon,
  NotRequierdIcon,
  RequierdIcon,
  SettingIcon,
} from "../../icons";

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
}) => {
  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, index) => {
            const isHiddenIcon = relatedParameters?.some(
              (relatedParam) => relatedParam.parameterId === parameter.id
            );
            return (
              <div key={index}>
                <div style={clasess.parameterContainer}>
                  <div style={clasess.parameterLabelStyle}>
                    <div style={clasess.paramNameStyle}>{parameter?.name} <small>&nbsp;{parameter?.defaultUnit}</small></div>

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
                    {!isHiddenIcon && (
                      <>
                        {parameter?.isHidden ? (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              updatedProductParameterHidden(
                                section?.id,
                                subSection?.id,
                                parameter
                              )
                            }
                          >
                            <HiddenIcon />
                          </div>
                        ) : (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              updatedProductParameterHidden(
                                section?.id,
                                subSection?.id,
                                parameter
                              )
                            }
                          >
                            <NotHiddenIcon />
                          </div>
                        )}
                      </>
                    )}

                    {parameter?.parameterType !== EParameterTypes.SWITCH ? (
                      parameter?.isRequired ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            updatedProductParameteRequierd(
                              section?.id,
                              subSection?.id,
                              parameter
                            )
                          }
                        >
                          <RequierdIcon />
                        </div>
                      ) : (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            updatedProductParameteRequierd(
                              section?.id,
                              subSection?.id,
                              parameter
                            )
                          }
                        >
                          <NotRequierdIcon />
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                  <div style={clasess.renderParameterTypeContainer}>
                    {_renderParameterType(
                      section?.id,
                      subSection?.id,
                      parameter,
                      subSection?.parameters
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
