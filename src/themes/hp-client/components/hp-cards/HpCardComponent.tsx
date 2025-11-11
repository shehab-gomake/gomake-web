import { Card } from "@mui/material";
import { CSSProperties } from "react";

interface IHpCardProps {
  textColor?: string;
  numberColor?: string;
  text?: string;
  number?: string;
  icon?: JSX.Element;
  style?: CSSProperties;
}

const HpCardComponent = ({
  text,
  textColor,
  numberColor,
  number,
  icon,
  style,
}: IHpCardProps) => {
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px 16px 0px 16px",
    // gap: "20px",
    width: "190px",
    height: "100px",
    borderRadius: "12px",
    ...style,
  };

  // Icon + Text Row styles from Figma
  const iconTextRowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "0px",
    gap: "8px",
    width: "162px",
    height: "18px",
    borderRadius: "0px",
    flex: "none",
    order: 0,
    flexGrow: 0,
  };

  // Icon styles from Figma
  const iconStyle: CSSProperties = {
    width: "16px",
    height: "16px",
    borderRadius: "0px",
    flex: "none",
    order: 0,
    flexGrow: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  // Text styles from Figma
  const textStyle: CSSProperties = {
    width: "auto",
    height: "18px",
    borderRadius: "0px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    fontFamily: '"Forma DJR UI", sans-serif',
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "18px",
    color: textColor || "#FFFFFF",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "center",
  };

  // Number Container styles from Figma
  const numberContainerStyle: CSSProperties = {
    width: "162px",
    height: "40px",
    borderRadius: "0px",
    flex: "none",
    order: 1,
    flexGrow: 0,
    display: "flex",
    alignItems: "flex-end",
  };

  // Number text styles from Figma
  const numberStyle: CSSProperties = {
    width: "auto", // Auto width instead of fixed 24px for flexibility
    height: "40px",
    borderRadius: "0px",
    fontFamily: '"Forma DJR UI", sans-serif',
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "40px", // or 114%
    color: numberColor || textColor || "#FFFFFF",
    margin: 0,
    padding: 0,
    display: "flex",
    alignItems: "flex-end",
  };

  return (
    <Card
      sx={{
        ...containerStyle,
        boxShadow: "none",
      }}
    >
      {/* Icon + Text Row */}
      <div style={iconTextRowStyle}>
        <span style={iconStyle}>{icon}</span>
        <span style={textStyle}>{text}</span>
      </div>

      {/* Number */}
      <div style={numberContainerStyle}>
        <span style={numberStyle}>{number}</span>
      </div>
    </Card>
  );
};

export { HpCardComponent };
