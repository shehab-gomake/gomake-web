import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = ({ headerTable }: any) => {
  const { secondColor, primaryColor } = useGomakeTheme();

  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "85%" },
      mainContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: convertWidthToVW(10),
        width: "100%",
        marginBottom: convertHeightToVH(20),
        backgroundColor: "rgba(100,160,300,0.3)",
      },
      headerTitle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
      },
      tableContainer: {
        width: "100%",
        marginTop: convertHeightToVH(-30),
      },
      inputDataContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        marginTop: convertHeightToVH(10),
        backgroundColor: "#EBECFF",
        paddingTop: 10,
        paddingBottom: 10,
        borderTop: `2px solid ${secondColor(500)}`,
      },
      rowItemStyle: {
        width: `${100 / headerTable.length}%`,
        display: "flex",
        justifyContent: "center",
        position: "relative" as "relative",
      },
      dropDownListContainer: {
        width: "80%",
        alignSelf: "center",
      },
      textInputStyle: {
        width: "100%",
        height: 40,
        alignSelf: "center",
      },
      switchStyle: {
        alignSelf: "center",
      },
      iconStyle: {
        color: primaryColor(300),
        position: "absolute" as "absolute",
        right: -0,
        // marginRight: convertWidthToVW(10),
      },
      updatedIcon: {
        color: primaryColor(300),
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
