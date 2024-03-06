import { useMemo } from "react";
import { convertHeightToVH } from "@/utils/adapter";
import { HEADER_HEIGHT, SCREEN_HEIGHT } from "@/utils/layout-config";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      mainGridContainer: {
        display: "grid" as "grid",
        gridTemplateRows: "auto 1fr",
        background: "#F6F6F6",
        padding: 10,
        gridGap: "8px",
        maxHeight: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        height: convertHeightToVH(SCREEN_HEIGHT - HEADER_HEIGHT),
        overflowY: "hidden" as "hidden",
      },
      skeletonCpntainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 10,
      },
      bodyGridContainer: {
        display: "grid",
        gridTemplateColumns: "60% auto",
        gridGap: "9px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
