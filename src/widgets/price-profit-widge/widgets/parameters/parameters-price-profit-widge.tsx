
import { useStyle } from "./style";
import { ParameterListWidget } from "./parameter-list-widget";

const ParmaetersPriceProfitWidget = ({ parameters, updateDropdownValue, updateDropdownMaterialValue, updateTextInputValue, updateProfitProfileProductParameter }: {
  parameters: any,
  updateDropdownValue: (value: any, index: number) => void,
  updateDropdownMaterialValue: (value: any, index: number) => void,
  updateTextInputValue: (value: string, index: number) => void,
  updateProfitProfileProductParameter: (data: any, value: any) => void
}) => {
  const { classes } = useStyle();

  const colorsMock = [
    {
      color: "#B42318",
      border: "#FECDCA",
      backgroundColor: "#FEF3F2",
    },
    {
      color: "#B93815",
      border: "#F9DBAF",
      backgroundColor: "#FEF6EE",
    },
    {
      color: "#5925DC",
      border: "#9294D8",
      backgroundColor: "#D0D1ED",
    },
    {
      color: "#B92775",
      border: "#F09FD1",
      backgroundColor: "#F9D8ED",
    },
    {
      color: "#344054",
      border: "#EAECF0",
      backgroundColor: "#F9FAFB",
    },
    {
      color: "#026AA2",
      border: "#B9E6FE",
      backgroundColor: "#F0F9FF",
    }
  ]

  return (
    <div style={classes.mainContainer}>
      <div style={classes.parameterContainer}>
        {parameters?.map((parameter: any, index: number) => {
          let displayValue = '';

          if (parameter.parameterType === 1 || parameter.parameterType === 2) {
            displayValue = parameter.defaultValue;
          } else if (parameter.parameterType === 0) {
            const defaultValue = parameter.values.find((value: any) => value.isDefault);
            displayValue = defaultValue ? defaultValue.parameterName : '';
          }
          else if (parameter.parameterType === 5) {
            displayValue = parameter.defaultValue
          }
          // Use modulo to cycle through colorsMock
          const colorStyle = colorsMock[index % colorsMock.length];

          return (
            <ParameterListWidget
              parameter={parameter}
              index={index}
              colorStyle={colorStyle}
              displayValue={displayValue}
              updateDropdownValue={updateDropdownValue}
              updateDropdownMaterialValue={updateDropdownMaterialValue}
              updateTextInputValue={updateTextInputValue}
              updateProfitProfileProductParameter={updateProfitProfileProductParameter}
            />
          );
        })}
      </div>
    </div>
  );
};
export { ParmaetersPriceProfitWidget };
