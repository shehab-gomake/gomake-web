import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { grayColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      contentContainer: {
        padding: "10px 0",
      },
      description: {
        color: grayColor(500),
        fontSize: "14px",
        lineHeight: "1.5",
        ...FONT_FAMILY.Lexend(400, 14),
      },
      sectionTitle: {
        fontWeight: 600,
        color: grayColor(500),
        fontSize: "14px",
        marginBottom: "4px",
        ...FONT_FAMILY.Lexend(600, 14),
      },
      textInput: {
        width: "100%",
      },
      dividerContainer: {
        margin: "16px 0",
        display: "flex",
        alignItems: "center",
        width: "100%",
      },
      divider: {
        flex: 1,
        height: "1px",
        backgroundColor: "#E0E0E0",
      },
      dividerText: {
        color: grayColor(500),
        padding: "0 12px",
        fontSize: "12px",
        ...FONT_FAMILY.Lexend(400, 12),
      },
      uploadButton: {
        width: "100%",
        height: "44px",
        textTransform: "none" as "none",
      },
      fileName: {
        color: grayColor(500),
        fontStyle: "italic" as "italic",
        fontSize: "12px",
        marginTop: "4px",
        ...FONT_FAMILY.Lexend(400, 12),
      },
    };
  }, [grayColor]);
  return {
    classes,
  };
};

export { useStyle };

