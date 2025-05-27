import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = ({ note }) => {
  const { theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      textArea: {
        width: "100%",
        height: "60px",
        fontSize: 12,
        borderRadius: 6,
        padding: 6,
        border: `1px solid ${primaryColor(500)}`,
        resize: "none" as "none",
        outline: "none" as "none",
        backgroundColor: "#fff",
      },

      box: {
        border: "1px solid #D1D1D1",
        borderRadius: 6,
        padding: "6px 8px",
        backgroundColor: "#fff",
        fontSize: 12,
        color: note ? "#000" : "#999",
        cursor: "pointer",
        minHeight: "40px",
        maxHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "4px",
        wordBreak: "break-word",
        flexWrap: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
        maxWidth: "100%",
      },
      span: {
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "180px",
      },
      iconsBox: {
        display: "flex",
        justifyContent: "center",
        gap: 1,
      },
      editIcon: {
        fontSize: 18,
        color: "#888",
        marginLeft: "auto",
      },
    };
  }, [theme, note]);
  return {
    classes,
  };
};
export { useStyle };
