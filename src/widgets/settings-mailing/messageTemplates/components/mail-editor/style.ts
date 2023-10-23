import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { convertHeightToVH } from "@/utils/adapter";


const useStyle = () => {
    const { primaryColor, secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            iconStyle: {
                color: secondColor(300),
                background: primaryColor(300),
            },
            dropDownListStyle: {
                width: "170px",
                borderRadius: 4,
                height: 40,
                backgroundColor: "#FFF",
                border: "0px",
                boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.08)",
            },
            containerStyle: {
                display: "flex",
                gap: "20px",
                flexDirection: "column" as "column",
                marginTop: "10px"
            },
            headerStyle: {
                ...FONT_FAMILY.Lexend(400, 16),
                color: "#7E7E7E",
                lineHeight: "20px",
            },
            editorStyle1: {
                height: convertHeightToVH(150),
                borderRadius: "0px 0px 12px 12px",
                borderColor: "#9695C7"
            },

            editorStyle2: {
                height: convertHeightToVH(300),
                borderRadius: "0px 0px 12px 12px",
                borderColor: "#9695C7"
            },
            variableStyle: {
                ...FONT_FAMILY.Lexend(400, 13),
                display : "flex",
                width: "121px",
                height: "24px",
                borderRadius: "4px",
                background: "#FFFFFF",
                color: "#2E3092",
                justifyContent: "center",
                padding: "2px",
                //background: primaryColor(50)
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
