import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            pdfLabelStyle: {
                ...FONT_FAMILY.Lexend(400, 12),
                color: primaryColor(300),
                lineHeight: "15px",
            },
            pdfCellStyle: {
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent : "flex-start",
            },
            labelStyle :{
                ...FONT_FAMILY.Lexend(400, 12),
                color: primaryColor(300),
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
