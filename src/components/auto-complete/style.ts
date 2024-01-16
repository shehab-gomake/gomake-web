import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            multiSelectStyle: {
                display:"flex",
                width:"200px",
                border: "0px"
            },
            multiSelectOption:{
                width: "100%",
                ...FONT_FAMILY.Lexend(400, 14),
                display: "flex",
                flexDirection : "row" as "row",
                alignItems:'center'
              },

        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };