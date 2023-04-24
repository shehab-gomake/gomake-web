import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      container: {
        marginTop: convertHeightToVH(50),
      },
      header: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: primaryColor(50),
        height: 42,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 14),
      },
      tableBody: {
        display: "flex",
        width: "100%",
        flexDirection: "column" as "column",
        alignitems: "flex-start",
      },
      skeletonRowStyle: {
        marginTop: convertHeightToVH(10),
      },
      noDataContainer: {
        display: "flex",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        color: secondColor(500),
        height: 200,
        lineHeight: "17.5px",
        ...FONT_FAMILY.Lexend(500, 22),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
