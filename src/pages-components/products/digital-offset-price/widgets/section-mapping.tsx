const SectionMappingWidget = ({
  clasess,
  index,
  subSection,
  section,
  _renderParameterType,
  _getParameter,
  relatedParameters,
  generalParameters,
}: any) => {
  return (
    <div key={index} style={clasess.subSectionContainer}>
      <div style={clasess.subSectionTitleStyle}>{subSection.name}</div>
      <div style={clasess.parametersContainer}>
        {subSection?.parameters
          ?.filter((param: any) => !param.isHidden)
          ?.filter((param: any) => {
            return !relatedParameters.some(
              (relatedParam) => relatedParam.parameterId === param.id
            );
          })
          ?.map((parameter: any, index: number) => {
            const value = _getParameter(parameter, subSection, section);
            return (
              <div key={index} style={{ display: "flex" }}>
                {_renderParameterType(
                  parameter,
                  subSection,
                  section,
                  subSection?.parameters,
                  value,
                  subSection?.parameters,
                  true
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export { SectionMappingWidget };
