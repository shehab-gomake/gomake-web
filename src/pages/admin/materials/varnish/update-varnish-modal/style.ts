import { useMemo } from "react";

import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
  const { secondColor, neutralColor, errorColor, primaryColor } =
    useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      insideStyle: { width: "95%", height: "70%" },
      firstSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 50,
      },
      secondSectionContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginTop: 10,
        marginBottom: 50,
      },
      titlePlusContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
      },
      firstSectionTitleStyle: {
        ...FONT_FAMILY.Lexend(700, 16),
        color: secondColor(500),
        borderBottom: `1px solid ${secondColor(500)}`,
        paddingBottom: 5,
      },
      sizeSectionTitleStyle: {
        ...FONT_FAMILY.Lexend(500, 14),
        color: secondColor(500),
        borderBottom: `1px solid ${secondColor(500)}`,
        paddingBottom: 5,
      },
      firstSectionTextInput: {
        marginTop: 20,
      },
      tableSections: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 10,
        backgroundColor: "rgba(0,0,0,0.1)",
        padding: 20,
        paddingBottom: 20,
        borderRadius: 4,
      },
      newAddWightsByCatagory: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 10,
        backgroundColor: "#f0f1f9",
        padding: 20,
        paddingBottom: 20,
        borderRadius: 4,
      },
      tableSecondSections: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 10,
        backgroundColor: "#ebecff",
        padding: 20,
        paddingBottom: 20,
        borderRadius: 4,
      },
      textInputStyle: {
        height: 42,
        width: 191,
      },
      lineStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        height: 1,
        width: "50%",
        backgroundColor: neutralColor(600),
        marginTop: 60,
      },
      lableTextStyle: {
        ...FONT_FAMILY.Lexend(600, 12),
        color: neutralColor(800),
        marginBottom: 10,
      },
      inputSizesContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
      },
      addSizesInputsSecondSelection: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex",
        alignItems: "flex-start",
        width: "100%",
        marginTop: 10,
        backgroundColor: "#ebddff",
        padding: 20,
        paddingBottom: 20,
        borderRadius: 4,
      },
      addSheetBtnContainer: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        alignSelf: "flex-end",
        alignContent: "flex-end",
        marginTop: 25,
      },
      btnsWightSheetContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "end",
        gap: 15,
      },
      addBtnStyle: {
        height: 40,
        backgroundColor: primaryColor(800),
        ...FONT_FAMILY.Lexend(400, 14),
      },
      cancelBtnStyle: {
        height: 40,
        backgroundColor: errorColor(500),
        ...FONT_FAMILY.Lexend(400, 14),
      },
      mainWaightsContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        flexWrap: "wrap" as "wrap",
        gap: 20,
      },
      controlsIconContainer: {
        display: "flex",
        flexDirection: "row" as "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "end",
      },
      multiSelectStyle: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        height: "100%",
        display: "flex",
        alignitems: "center",
        justifyContent: "center",
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
