import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const { neutralColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      cardStyle: {
        //border: "1px dotted #c9c8c3",
        textAlign: "center" as "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        width: "23%",
        height: "100px",
        boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
        display: "flex",
        alignItems: "center",
        padding :"20px",
        justifyContent: 'space-between',
      },
      numberStyle: {
        ...FONT_FAMILY.Lexend(500, 24),
      },
      descStyle: {
        color: neutralColor(600),
        ...FONT_FAMILY.Lexend(400, 14),
      }
    
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
