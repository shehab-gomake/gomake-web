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
        maxHeight: "80px", // LIMIT HEIGHT
        overflow: "hidden", // HIDE OVERFLOW
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2, // LIMIT TO 2 LINES
        WebkitBoxOrient: "vertical",
        wordBreak: "break-word", // BREAK LONG WORDS
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
