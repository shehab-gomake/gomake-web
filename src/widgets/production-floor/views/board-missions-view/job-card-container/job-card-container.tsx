import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useIsMobile } from "@/hooks/use-responsive";
import { FONT_FAMILY } from "@/utils/font-family";
import Stack from "@mui/material/Stack";
import { ReactNode, ReactElement, CSSProperties } from "react";

interface CardContainerProps {
  label?: string;
  children?: ReactNode;
  actionButton?: ReactElement;
  withHeader?: boolean;
  style?: CSSProperties;
}

const CardContainer = ({
  label,
  children,
  actionButton,
  withHeader = true,
  style,
}: CardContainerProps) => {
  const { primaryColor } = useGomakeTheme();
  const isMobileScreen = useIsMobile();

  return (
    <Stack
      style={{
        borderRadius: "8px",
        border: `1px solid ${primaryColor(500)}`,
        background: "#FFF",
        boxShadow: "0px 5px 31px 0px rgba(0, 0, 0, 0.06)",
        display: "flex",
        flexDirection: "column",
        ...(!isMobileScreen && { maxHeight: "100%", overflow: "hidden" }),
        ...style,
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
            background: primaryColor(500),
            boxShadow: "0px 5px 31px 0px rgba(0, 0, 0, 0.06)",
            color: "#FFFFFF",
            padding: "5px 16px",
            flexShrink: 0,
          }}
        >
          <span style={{ ...FONT_FAMILY.Inter(500, 15) }}>{label}</span>
          {actionButton && <span>{actionButton}</span>}
        </Stack>
      )}
      {/* Scrollable Content Area */}
      <Stack
        className={`custom-scroller`}
        style={{
          padding: "5px 16px",
          flexGrow: 1,
          // overflowY: "scroll",
          overflowY: "auto",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
};

export { CardContainer };
