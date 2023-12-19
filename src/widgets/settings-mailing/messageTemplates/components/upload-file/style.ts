import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = (onUpload : boolean) => {
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
                overflow: "hidden",
            },
            IconButtonStyle:{
                background: primaryColor(100),
                width: "24px",
                height: "24px"
            },
            attachmentContainer:{
                display: "flex",
                flexDirection:"row" as "row",
                alignItems: "center",
                justifyContent: "center",
                gap:"10px"
            },
            attachmentStyle:{
                display: "flex",
                flexDirection:"row" as "row",
                alignItems: "center",
                justifyContent: "center",
                gap:"10px",
                width: "170px",
                height: "40px",
                borderRadius: "4px",
                boxShadow: onUpload ? "0px 1px 10px rgba(0, 0, 0, 0.08)" : "none"
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
