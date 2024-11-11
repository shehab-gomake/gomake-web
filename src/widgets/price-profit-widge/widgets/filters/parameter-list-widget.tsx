
import { GoMakeMenu } from "@/components/menu/menu";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";

const ParameterListWidget = ({ parameter, index, colorStyle, displayValue }: { parameter: any, index: number, colorStyle: any, displayValue: string }) => {
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

  return (
    <>
      <span
        key={index}
        onClick={handleOpen}
        style={{
          ...classes.parameterItem,
          color: colorStyle.color,
          border: `1px solid ${colorStyle.border}`,
          backgroundColor: colorStyle.backgroundColor,
        }}
      >
        {`${t(parameter.ParameterName)}: ${displayValue}`}
      </span>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
        style={parameter?.Type === "1" ? {
          marginTop: 10,
          marginLeft: 100,
        } : {}}
      >
        <div style={classes.menuContainer}>
          {parameter?.Type === "0" || parameter?.Type === "5" ? (
            <GoMakeAutoComplate
              options={parameter?.values}
              placeholder={`Select ${t(parameter.ParameterName)}`}
              style={{
                width: 170,
                height: 34,
                border: "none",
              }}
            />
          ) : parameter?.Type === "1" || parameter?.Type === "2" ? (
            <GomakeTextInput
              defaultValue={parameter?.defualtValue}
              placeholder={`Enter ${t(parameter.ParameterName)}`}
              style={{
                width: 170,
                height: 34,
                borderRadius: 8,
              }}
            />
          ) : null}
        </div>
      </GoMakeMenu>
    </>

  );
};
export { ParameterListWidget };
