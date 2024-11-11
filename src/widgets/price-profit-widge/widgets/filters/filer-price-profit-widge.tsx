
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";

const FilterPriceProfitWidget = ({ parameters }: { parameters: any }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  console.log(parameters)

  return (
    <div style={classes.mainContainer}>
      <div style={classes.parameterContainer}>
        {parameters.map((parameter: any, index: number) => {
          let displayValue = '';

          if (parameter.Type === '1') {
            displayValue = parameter.defualtValue;
          } else if (parameter.Type === '0' || parameter.Type === '5') {
            const defaultValue = parameter.values.find((value: any) => value.isDefualt);
            displayValue = defaultValue ? defaultValue.label : '';
          }

          return (
            <span key={index} style={classes.parameterItem}>
              {`${t(parameter.ParameterName)}: ${displayValue}`}
            </span>
          );
        })}
      </div>
    </div>
  );
};
export { FilterPriceProfitWidget };
