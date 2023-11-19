import { GoMakeAutoComplate } from "@/components";
import { generalParametersState } from "@/store";
import { useSetRecoilState } from "recoil";

const SelectChildParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  onChangeForPrice,
  subSection,
  section,
}) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  const setGeneralParameters = useSetRecoilState<any>(generalParametersState);
  return (
    <GoMakeAutoComplate
      options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
      placeholder={parameter.name}
      style={clasess.dropDownListStyle}
      getOptionLabel={(option: any) => option.updateName}
      defaultValue={
        index !== -1 ? { updateName: temp[index].values } : defaultObject
      }
      onChange={(e: any, value: any) => {
        if (subSection?.type) {
          onChangeSubProductsForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { valueIds: value?.id, values: value?.updateName },
            subSection?.type,
            index,
            parameter?.actionIndex
          );
        } else {
          onChangeForPrice(
            parameter?.id,
            subSection?.id,
            section?.id,
            parameter?.parameterType,
            parameter?.name,
            parameter?.actionId,
            { valueIds: value?.id, values: value?.updateName },
            index,
            parameter?.actionIndex
          );
        }
        setGeneralParameters((prev) => {
          let temp = [...prev];
          parameter?.childsParameters.forEach((parameter) => {
            const parameterId = parameter.id;
            if (value?.values.hasOwnProperty(parameterId)) {
              const index = temp.findIndex(
                (item) =>
                  item?.parameterId === parameter?.id &&
                  item?.sectionId === section?.id &&
                  item?.subSectionId === subSection?.id &&
                  item?.actionIndex === parameter?.actionIndex
              );

              if (index !== -1) {
                temp[index] = {
                  ...temp[index],
                  values: [value?.values[parameterId]],
                };
              } else {
                temp.push({
                  parameterId: parameter?.id,
                  sectionId: section?.id,
                  subSectionId: subSection?.id,
                  ParameterType: parameter?.parameterType,
                  values: [value?.values[parameterId]],
                });
              }
            }
          });
        });
      }}
    />
  );
};

export { SelectChildParameterWidget };
