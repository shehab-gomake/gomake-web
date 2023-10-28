const SectionMappingWidget = ({
  clasess,
  index,
  subSection,
  section,
  _renderParameterType,
  _getParameter,
}: any) => {
  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((param: any) => !param.isHidden)
          ?.map((parameter: any, index: number) => {
            const value = _getParameter(parameter, subSection, section);
            return (
              <div key={index}>
                <div style={clasess.parameterContainer}>
                  <div
                    style={
                      value?.value === "true"
                        ? clasess.parameterType3ActiveLabelStyle
                        : clasess.parameterLabelStyle
                    }
                  >
                    {parameter?.name}
                    {parameter?.isRequired ? (
                      <span style={clasess.spanRequierd}> *</span>
                    ) : null}
                  </div>
                  <div style={clasess.renderParameterTypeContainer}>
                    {_renderParameterType(
                      parameter,
                      subSection,
                      section,
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
