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
        {subSection?.parameters?.map((parameter, index) => {
          return (
            <div key={index}>
              {!parameter?.isHidden ? (
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
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { SectionMappingWidget };
