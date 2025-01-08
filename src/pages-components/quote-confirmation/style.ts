import { adaptPaddingRight } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ direction }) => {
  const classes = useMemo(() => {
    return {
      firstContainer: {
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column" as "column",
        background: "#FFFFFF",
        overflow: "scroll",
      },
      iconStyle: {
        width: "100%",
        height: "7%",
        display: "flex",
        background: "#F4F1F6",
        // padding: "22px 80px",
        padding: "30px 110px",
        alignItems: "center",
      },
      iconMobileStyle: {
        width: "100%",
        height: "7%",
        display: "flex",
        background: "#F4F1F6",
        alignItems: "center",
        padding: "25px 20px",
        // padding: "35px 0px",
        // justifyContent: "center",
      },
      printHouseLogo: {
        width: 50,
        height: 50,
        objectFit: "contain" as "contain",
        borderRadius: "12px",
        padding: "4px",
        // backgroundColor: "#8283be",
      },
      printHouseName: {
        color: "#000000",
        ...adaptPaddingRight(direction, 8),
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
