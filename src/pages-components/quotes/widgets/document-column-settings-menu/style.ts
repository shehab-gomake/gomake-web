import { useMemo } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { t } = useTranslation();
  const classes = useMemo(() => {
    return {
      headerContainer: {
        maxHeight: "30vh",
        overflowY: "auto" as "auto",
      },
      topBtns: {
        ...FONT_FAMILY.Inter(500, 13),
        padding: "4px 8px",
      },
      iconButton: {
        backgroundColor: "#f5f5f5",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "8px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#2e3092",
          borderColor: "#2e3092",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(46, 48, 146, 0.15)",
          "& .MuiSvgIcon-root": {
            color: "#fff",
          },
        },
      },
    };
  }, [i18next.language, t]);
  return {
    classes,
  };
};
export { useStyle };
