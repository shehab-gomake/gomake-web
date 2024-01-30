import { ISetState } from "@/services/hooks/call-api.interface";
import get from "lodash.get";

const returnResult = (
  result: any,
  setState: ISetState | undefined,
  key: string = "data.data.data"
) => {
  const _data = get(result, key);
  if (_data) {
    if (setState) {
      setState(_data);
    }
    return _data;
  }
  return [];
};

export { returnResult };

export const findParameterById = (template, targetCode) => {
  // Function to recursively search for a parameter by id
  const findParameter = (sections) => {
    for (const section of sections) {
      if (section.subSections && section.subSections.length > 0) {
        // If subSections exist, recursively search within them
        const nestedParameter = findParameter(section.subSections);
        if (nestedParameter) {
          return nestedParameter;
        }
      }

      for (const subSection of section.subSections || []) {
        const parameter = subSection.parameters.find(param => param.code === targetCode);
        if (parameter) {
          return parameter;
        }
      }
    }
    return null;
  };

  // Call the findParameter function with the top-level sections
  return findParameter(template.sections || []);
};