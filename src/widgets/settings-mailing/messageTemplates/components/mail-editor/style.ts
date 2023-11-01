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
                gap: "10px",
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
                width: "810px"

            },
            editorStyle2: {
                height: convertHeightToVH(300),
                borderRadius: "0px 0px 12px 12px",
                borderColor: "#9695C7",
                ...FONT_FAMILY.Lexend(400, 16),
                lineHeight: "20px",
                color: primaryColor(900),
                width: "810px"

            },
            variableStyle: {
                ...FONT_FAMILY.Lexend(400, 13),
                display: "flex",
                width: "110px",
                height: "24px",
                borderRadius: "4px",
                background: "#FFFFFF",
                color: "#2E3092",
                justifyContent: "center",
                padding: "1px",
                margin: "5px",
                border: "1px solid rgb(130, 131, 190)",
            },
            variablesContainer: {
                paddingTop: "6px",
                width: "775px",
            },
            footerStyle: {
                display: "flex",
                alignSelf: "flex-end",
                gap: "10px",
                // position: "fixed" as "fixed",
                // bottom: "10px",
            },

            switchStyle: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "2px",
                width: "36px",
                height: "20px",
                background: primaryColor(600),
                borderRadius: "12px",
                flex: "none",
                order: 0,
                flexGrow: 0,
                 boxShadow: "0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
            }

        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
