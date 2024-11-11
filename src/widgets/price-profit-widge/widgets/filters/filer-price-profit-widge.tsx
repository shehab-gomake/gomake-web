
import { GoMakeMenu } from "@/components/menu/menu";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ParameterListWidget } from "./parameter-list-widget";

const FilterPriceProfitWidget = ({ parameters }: { parameters: any }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
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
        {parameters.map((parameter: any, index: number) => {
          let displayValue = '';

          if (parameter.Type === '1') {
            displayValue = parameter.defualtValue;
          } else if (parameter.Type === '0' || parameter.Type === '5') {
            const defaultValue = parameter.values.find((value: any) => value.isDefualt);
            displayValue = defaultValue ? defaultValue.label : '';
          }
          // Use modulo to cycle through colorsMock
          const colorStyle = colorsMock[index % colorsMock.length];

          return (
            <ParameterListWidget
              parameter={parameter}
              index={index}
              colorStyle={colorStyle}
              displayValue={displayValue}
            />
          );
        })}
      </div>
    </div>
  );
};
export { FilterPriceProfitWidget };
