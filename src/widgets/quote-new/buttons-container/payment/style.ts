import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const { theme, primaryColor } = useGomakeTheme();

    const classes = useMemo(() => {
        return {
            mainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                gap: "10px",
                alignItems: "center",
            },
            firstWidgetStyle: {
                display: "flex",
                flexDirection: "column" as "column",
                gap: "10px",
                width: "100%",
                alignItems: "center",

            },
            divStyle: {
                height: "30%",
                display: "flex",
                flexDirection: "column" as "column",
                alignItems: "flex-start",
                gap: "10px",
                padding: "0 10px"
            },
            textStyle: {
                color: primaryColor(900),
                ...FONT_FAMILY.Lexend(500, 14),
            },
            taxLBLStyle: {
                color: primaryColor(500),
                ...FONT_FAMILY.Lexend(600, 15),
            },
            taxInputStyle: {
                border: "none",
                outline: "none",
                borderBottom: `1.5px solid ${primaryColor(300)}`
            },
            inputStyle: {
                border: "none",
                outline: "none",
                textAlign: "center" as "center"
            },
            rowStyle: {
                display: "flex",
                alignSelf: "flex-start",
                width: "100%",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                padding: "5px"
            },
            containerStyle: {
                width: "50%",
                border: "2px solid rgba(0, 0, 0, 0.04)",
                boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
                borderRadius: "4px"
            },
            saveBtn: {
                display: "flex",
                alignSelf: "flex-start",
                width: "100%"
            },
            inputLbl: {
                color: primaryColor(900),
                ...FONT_FAMILY.Lexend(600, 14),
                display: "flex",
                alignItems: "flex-end",
            },
            selectLbl: {
                color: primaryColor(900),
                ...FONT_FAMILY.Lexend(600, 14),
                display: "flex",
                alignItems: "center",
            },
            creditCardInputsContainer: {
                display: "flex",
                width: "75%",
                padding: "4px",
                border: `1.5px solid ${primaryColor(300)}`,
                borderRadius: "4px"
            },
            creditCardSecondInputsContainer: {
                display: "flex",
                width: "75%",
                gap: "10%"
            },
            creditCardInputs: {
                border: "none",
                outline: "none",
                ...FONT_FAMILY.Lexend(500, 14),
            },
            creditSecondCardInputs: {
                outline: "none",
                ...FONT_FAMILY.Lexend(500, 14),
                border: `1.5px solid ${primaryColor(300)}`,
                borderRadius: "4px",
                width: "45%",
                padding: "4px"
            },
            selectInputs: {
               ...FONT_FAMILY.Lexend(500, 14),
               border: 0,
                //border: `1.5px solid ${primaryColor(300)}`,
                width: "100%",
                height: "33px", 
            },
            creditButtons: {
                ...FONT_FAMILY.Lexend(500, 14),
                width: "fit-content",
                height: "fit-content",
                padding: "10px 10px",
                textDecoration: "underline"
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
