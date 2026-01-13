import { SxProps, Theme } from "@mui/material";

interface StyleProps {
  direction: "rtl" | "ltr";
  successColor: (degree: number) => string;
  errorColor: (degree: number) => string;
  neutralColor: (degree: number) => string;
  primaryColor?: (degree: number) => string;
}

export const style = ({
  direction,
  successColor,
  errorColor,
  neutralColor,
}: StyleProps) => {
  const isRTL = direction === "rtl";

  const firstContainer: SxProps<Theme> = {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#FFFFFF",
    overflow: "scroll",
    direction: direction,
  };

  const iconStyle: SxProps<Theme> = {
    width: "100%",
    height: "7%",
    display: "flex",
    background: "#F4F1F6",
    padding: "30px 110px",
    alignItems: "center",
  };

  const iconMobileStyle: SxProps<Theme> = {
    width: "100%",
    minHeight: "60px",
    display: "flex",
    background: "#F4F1F6",
    alignItems: "center",
    padding: { xs: "16px 20px", sm: "25px 20px" },
  };

  const printHouseLogo: React.CSSProperties = {
    width: 50,
    height: 50,
    objectFit: "contain",
    borderRadius: "12px",
    padding: "4px",
    flexShrink: 0,
  };

  const contentWrapper: SxProps<Theme> = {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: neutralColor(50),
    padding: { xs: "16px", sm: "24px" },
    overflow: "auto",
  };

  const container: SxProps<Theme> = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: neutralColor(50),
    padding: "24px",
    direction: direction,
  };

  const content: SxProps<Theme> = {
    maxWidth: "600px",
    width: "100%",
    textAlign: "center",
    position: "relative",
  };

  const iconContainer: SxProps<Theme> = {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    position: "relative",
    animation: "pulse 2s ease-in-out infinite",
    "@keyframes pulse": {
      "0%, 100%": {
        transform: "scale(1)",
        opacity: 1,
      },
      "50%": {
        transform: "scale(1.05)",
        opacity: 0.9,
      },
    },
  };

  const iconContainerSuccess: SxProps<Theme> = {
    backgroundColor: successColor(100),
    boxShadow: `0 8px 32px ${successColor(200)}`,
    "& svg": {
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },
  };

  const iconContainerError: SxProps<Theme> = {
    backgroundColor: errorColor(100),
    boxShadow: `0 8px 32px ${errorColor(200)}`,
    "& svg": {
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },
  };

  const titleSuccess: SxProps<Theme> = {
    fontWeight: 700,
    color: successColor(700),
    marginBottom: "8px",
    fontSize: { xs: "28px", sm: "36px", md: "42px" },
  };

  const titleError: SxProps<Theme> = {
    fontWeight: 700,
    color: errorColor(700),
    marginBottom: "8px",
    fontSize: { xs: "28px", sm: "36px", md: "42px" },
  };

  const message: SxProps<Theme> = {
    color: neutralColor(700),
    fontSize: "18px",
    lineHeight: 1.6,
    maxWidth: "500px",
    margin: "0 auto",
  };

  const loadingText: SxProps<Theme> = {
    color: neutralColor(600),
    fontWeight: 500,
  };

  const decorativeCircle: SxProps<Theme> = {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    opacity: 0.1,
    zIndex: -1,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: `radial-gradient(circle, ${successColor(300)} 0%, transparent 70%)`,
  };

  return {
    firstContainer,
    iconStyle,
    iconMobileStyle,
    printHouseLogo,
    contentWrapper,
    container,
    content,
    iconContainer,
    iconContainerSuccess,
    iconContainerError,
    titleSuccess,
    titleError,
    message,
    loadingText,
    decorativeCircle,
  };
};

