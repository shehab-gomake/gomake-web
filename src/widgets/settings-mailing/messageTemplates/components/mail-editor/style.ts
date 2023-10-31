import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { convertHeightToVH } from "@/utils/adapter";


const useStyle = () => {
    const { primaryColor, secondColor, neutralColor } = useGomakeTheme();
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
                gap: "24px",
                flexDirection: "column" as "column",
                marginTop: "10px"
            },
            subSection: {
                display: "flex",
                flexDirection: 'column' as 'column',
                gap: "20px",
                alignItems: "flex-start",
            },
            subSectionHeader: {
                ...FONT_FAMILY.Lexend(400, 16),
                color: neutralColor(600),
                lineHeight: "20px",
            },
            editorStyle1: {
                height: convertHeightToVH(150),
                borderRadius: "0px 0px 12px 12px",
                borderColor: "#9695C7",
                ...FONT_FAMILY.Lexend(400, 16),
                lineHeight: "20px",
                color: primaryColor(900),
                width:"810px"

            },
            editorStyle2: {
                height: convertHeightToVH(300),
                borderRadius: "0px 0px 12px 12px",
                borderColor: "#9695C7",
                ...FONT_FAMILY.Lexend(400, 16),
                lineHeight: "20px",
                color: primaryColor(900),
                width:"810px"

            },
            variableStyle: {
                ...FONT_FAMILY.Lexend(400, 13),
                display: "flex",
                width: "121px",
                height: "24px",
                borderRadius: "4px",
                background: "#FFFFFF",
                color: "#2E3092",
                justifyContent: "center",
                padding: "2px",
                margin: "5px"
            },
            variablesContainer: {
                padding: "8px",
                width: "700px"
            },
            footerStyle: {
                display: "flex",
                alignSelf: "flex-end",
                gap: "10px"
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
