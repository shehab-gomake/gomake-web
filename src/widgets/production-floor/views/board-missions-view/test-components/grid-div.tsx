import { FONT_FAMILY } from "@/utils/font-family";
import Stack from "@mui/material/Stack";
import { ReactNode, ReactElement } from "react";

interface CardContainerProps {
  label?: string;
  children?: ReactNode;
  actionButton?: ReactElement; // Optional button element
  withHeader?: boolean;
}

//!here
const CardContainer = ({
  label,
  children,
  actionButton,
  withHeader = true,
}: CardContainerProps) => {
  return (
    <Stack
      style={{
        borderRadius: "8px",
        border: "1px solid #EBEBEB",
        background: "#FFF",
        boxShadow: "0px 5px 31px 0px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Header with label and optional button */}
      {withHeader && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          style={{
            borderRadius: "8px 8px 0px 0px",
            background: "#2E3092",
            boxShadow: "0px 5px 31px 0px rgba(0, 0, 0, 0.06)",
            color: "#FFFFFF",
            padding: "8px 16px",
          }}
        >
          <span style={{ ...FONT_FAMILY.Inter(500, 15) }}>{label}</span>
          {actionButton && <span>{actionButton}</span>}
        </Stack>
      )}

      {/* Content Area */}
      <Stack
        style={{
          padding: "0px 16px",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export { CardContainer };
