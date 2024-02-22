import { GoMakeAutoComplate } from "@/components";
import { subProductsParametersState } from "@/store";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

const SelectChildParameterWidget = ({
  parameter,
  clasess,
  index,
  temp,
  onChangeSubProductsForPrice,
  subSection,
  section,
}) => {
  const defaultObject = parameter.valuesConfigs.find(
    (item) => item.isDefault === true
  );
  const [subProducts, setSubProducts] = useRecoilState<any>(
    subProductsParametersState
  );
  const subProductsParams = subProducts?.find(
    (item) => item.type === subSection?.type
  )?.parameters;
  const [value, setValue] = useState<any>();
  useEffect(() => {
    if (subProductsParams) {
      let temp = [...subProductsParams];
      parameter?.childsParameters.forEach((myparameter) => {
        const parameterId = myparameter.id;
        if (value?.values.hasOwnProperty(parameterId)) {
          const myindex = temp.findIndex((item) => {
            return (
              item?.parameterId === myparameter?.id &&
              item?.sectionId === section?.id &&
              item?.subSectionId === subSection?.id &&
              item?.actionIndex === myparameter?.actionIndex
            );
          });

          if (myindex !== -1) {
            temp[myindex] = {
              ...temp[myindex],
              parameterCode: myparameter?.code,
              values: [value?.values[parameterId]],
            };
          } else {
            temp.push({
              parameterId: myparameter?.id,
              sectionId: section?.id,
              subSectionId: subSection?.id,
              ParameterType: myparameter?.parameterType,
              values: [value?.values[parameterId]],
              actionIndex: myparameter?.actionIndex,
              parameterName: myparameter?.name,
              parameterCode: myparameter?.code,
            });
          }
        }
      });
      const updatedSubProducts = subProducts.map((item) => {
        if (item.type === subSection?.type) {
          return {
            ...item,
            parameters: temp,
          };
        }

        return item;
      });
      setSubProducts(updatedSubProducts);
    }
  }, [value]);
  return (
    <div data-tour={parameter?.id} style={{width: '100%'}}>
      {parameter?.valuesConfigs?.length > 0 && (
        <GoMakeAutoComplate
            data-tour={parameter?.id}
          options={parameter?.valuesConfigs?.filter((value) => !value.isHidden)}
          placeholder={parameter.name}
          key={parameter.id + "-" + parameter.actionIndex}
          style={clasess.dropDownListStyle}
          getOptionLabel={(option: any) => option.updateName}
          defaultValue={
            index !== -1 ? { updateName: temp[index].values } : defaultObject
          }
          onChange={(e: any, value: any) => {
            setValue(value);
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
              parameter?.actionIndex,
              parameter?.code
            );
          }}
        />
      )}
    </div>
  );
};

export { SelectChildParameterWidget };
