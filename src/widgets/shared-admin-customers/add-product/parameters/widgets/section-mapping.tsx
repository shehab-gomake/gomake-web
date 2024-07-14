import { EParameterTypes } from "@/enums";
import {
  HiddenIcon,
  NotHiddenIcon,
  NotRequiredIcon,
  RequiredIcon,
  SettingIcon,
} from "../../icons";
import { LockedIcon } from "../../icons/lock-icon";
import { NotLockedIcon } from "../../icons/not-lock-icon";
import { NotDetailIcon } from "../../icons/not-detail-icon";
import { DetailIcon } from "../../icons/detail-icon";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((x) => !x.isHiddenInSetting)
          ?.map((parameter, index) => {
            console.log("parameter", parameter)
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
                          <RequiredIcon />
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
                          <NotRequiredIcon />
                        </div>
                      )
                    ) : (
                      <></>
                    )}
                    {(
                      parameter?.isLock ? (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            updatedProductParameteLocked(
                              section?.id,
                              subSection?.id,
                              parameter
                            )
                          }
                        >
                          <LockedIcon />
                        </div>
                      ) : (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            updatedProductParameteLocked(
                              section?.id,
                              subSection?.id,
                              parameter
                            )
                          }
                        >
                          <NotLockedIcon />
                        </div>
                      )
                    )}

                    {
                      <>
                        {parameter?.isShowToClient ? (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              updatedProductParameterShowToClient(
                                section?.id,
                                subSection?.id,
                                parameter
                              )
                            }
                          >
                            <InfoOutlinedIcon style={{ ...clasess.detailsIconStyle, color: "#F135A3" }} />
                          </div>
                        ) : (
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              updatedProductParameterShowToClient(
                                section?.id,
                                subSection?.id,
                                parameter
                              )
                            }
                          >
                            <InfoOutlinedIcon style={{ ...clasess.detailsIconStyle, color: "#A4A4A4" }} />
                          </div>
                        )}
                      </>
                    }
                  </div>
                  <div style={clasess.renderParameterTypeContainer}>
                    {_renderParameterType(
                      section?.id,
                      subSection?.id,
                      parameter,
                      subSection?.parameters,
                      index
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
