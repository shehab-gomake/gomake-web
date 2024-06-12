import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH } from "@/utils/adapter";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        boxShadow: "0px 4px 40px rgba(0, 0, 0, 0.08)",
        //   height: convertHeightToVH(735)
        //  height:"100%"
      },
      header: {
        ...FONT_FAMILY.Lexend(500, 20),
        color: primaryColor(500),
        textAlign: "center" as "center",
        padding: "14px 0 24px 0",
      },
      listContainer: {
        backgroundColor: "inherit",
        overflow: "auto",
        height: "68vh",
      },
      buttonWrapper: {
        padding: "3px 14px",
      },
      deleteButtonDirection: {
        display: "flex",
        flexDirection: "row-reverse" as "row-reverse",
        zIndex: 0
      },
      menuStyle: {
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      },
      menuItem: {
        display: "flex",
        width: 125,
        justifyContent: "space-between",
        alignItems: "center",
        color: primaryColor(300),
      },
      iconColor: primaryColor(300),
    };
  }, []);
  return {
    classes,
  };
};

export { useStyle };