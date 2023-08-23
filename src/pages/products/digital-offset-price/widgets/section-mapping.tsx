const SectionMappingWidget = ({
  clasess,
  index,
  subSection,
  section,
  _renderParameterType,
}: any) => {
  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((param: any) => !param.isHidden)
          ?.map((parameter: any, index: number) => {
            if (parameter?.parameterType === 3) {
              return (
                <div key={index}>
                  <div style={clasess.parameterType3Container}>
                    <div style={clasess.parameterLabelStyle}>
                      {parameter?.name}
                      {parameter?.isRequired ? (
                        <span style={clasess.spanRequierd}> *</span>
                      ) : null}
                    </div>
                    <div style={{ marginTop: -9 }}>
                      {_renderParameterType(parameter, subSection, section)}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  <div style={clasess.parameterContainer}>
                    <div style={clasess.parameterLabelStyle}>
                      {parameter?.name}
                      {parameter?.isRequired ? (
                        <span style={clasess.spanRequierd}> *</span>
                      ) : null}
                    </div>
                    <div style={clasess.renderParameterTypeContainer}>
                      {_renderParameterType(parameter, subSection, section)}
                    </div>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export { SectionMappingWidget };
