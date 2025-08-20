import { useStyle } from "./style";
import { ParameterListWidget } from "./parameter-list-widget";
import { IconButton, Tooltip } from "@mui/material";
import { ReloadIcon } from "@/icons";
import { useTranslation } from "react-i18next";

const ParmaetersPriceProfitWidgett = ({
  parameters,
  updateDropdownValue,
  updateDropdownMaterialValue,
  updateTextInputValue,
  updateProfitProfileProductParameter,
  reCalculatePrice,
}: {
  parameters: any;
  updateDropdownValue: (value: any, index: number) => void;
  updateDropdownMaterialValue: (value: any, index: number) => void;
  updateTextInputValue: (value: string, index: number) => void;
  updateProfitProfileProductParameter: (data: any, value: any) => void;
  reCalculatePrice: () => void;
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const parametersBySection = parameters.reduce((acc: any, parameter: any) => {
    if (!acc[parameter.sectionName]) {
      acc[parameter.sectionName] = [];
    }
    acc[parameter.sectionName].push(parameter);
    return acc;
  }, {});
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
      color: "#1F7A8C",
      border: "#A0DDE6",
      backgroundColor: "#E0F7FA",
    },
    {
      color: "#FF6F61",
      border: "#FFD1C1",
      backgroundColor: "#FFF0EB",
    },
    {
      color: "#026AA2",
      border: "#B9E6FE",
      backgroundColor: "#F0F9FF",
    },
    {
      color: "#A83232",
      border: "#F5B7B1",
      backgroundColor: "#FDEDEC",
    },
    {
      color: "#A85D32",
      border: "#F7C6A3",
      backgroundColor: "#FEF5E7",
    },
    {
      color: "#8A2BE2",
      border: "#D8BFD8",
      backgroundColor: "#E6E6FA",
    },
    {
      color: "#228B22",
      border: "#98FB98",
      backgroundColor: "#F0FFF0",
    },
  ];

  return (
    <div style={classes.mainContainer}>
      <div
        style={
          dir === "rtl"
            ? classes.reCalculateContainerRTL
            : classes.reCalculateContainer
        }
        onClick={reCalculatePrice}
      >
        {/* <Tooltip title={t("priceProfit.reCalculatePrice")}>
          <IconButton onClick={reCalculatePrice}>
            <ReloadIcon width={18} height={18} />
          </IconButton>
        </Tooltip> */}
        {t("priceProfit.calculatePrice")}
      </div>
      {Object.entries(parametersBySection).map(
        ([sectionName, sectionParameters]: [string, any[]]) => (
          <div key={sectionName} style={classes.sectionContainer}>
            <div style={classes.sectionName}>{sectionName}</div>
            <div style={classes.parameterContainer}>
              {sectionParameters.map((parameter: any, index: number) => {
                let displayValue = "";

                if (
                  parameter.parameterType === 1 ||
                  parameter.parameterType === 2
                ) {
                  displayValue = parameter.defaultValue;
                } else if (parameter.parameterType === 0) {
                  const defaultValue = parameter.values.find(
                    (value: any) => value.isDefault
                  );
                  displayValue = defaultValue ? defaultValue.name : "";
                } else if (parameter.parameterType === 5) {
                  displayValue = parameter.defaultValue;
                }
                // Use modulo to cycle through colorsMock
                const colorStyle = colorsMock[index % colorsMock.length];

                return (
                  <ParameterListWidget
                    key={parameter.parameterId}
                    parameter={parameter}
                    index={index}
                    colorStyle={colorStyle}
                    displayValue={displayValue}
                    updateDropdownValue={updateDropdownValue}
                    updateDropdownMaterialValue={updateDropdownMaterialValue}
                    updateTextInputValue={updateTextInputValue}
                    updateProfitProfileProductParameter={
                      updateProfitProfileProductParameter
                    }
                  />
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};
export { ParmaetersPriceProfitWidgett };
