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
                width: "100%",
                alignItems: "center",
            },
            creditCardInputsContainer: {
                display: "flex",
                width: "70%",
                padding: "4px",
                border: `1.5px solid ${primaryColor(300)}`,
                borderRadius: "4px"
            },
            creditSecondCardInputs: {
                outline: "none",
                ...FONT_FAMILY.Lexend(500, 14),
                border: `1.5px solid ${primaryColor(300)}`,
                borderRadius: "4px",
                width: "70%",
                padding: "4px"
            },
            creditCardInputs: {
                border: "none",
                outline: "none",
                ...FONT_FAMILY.Lexend(500, 14),
            },
            selectInputs: {
                ...FONT_FAMILY.Lexend(500, 14),
                //border: 0,
                border: `1px solid ${primaryColor(300)}`,
                width: "100%",
                height: "33px",
            },
            btnStyle: {
                ...FONT_FAMILY.Inter(600, 14),
                height: 40,
                //maxWidth: "272px",
                width: "70%",
                padding: "8px 14px",
                borderRadius: 8,
                lineHeight: "20px",
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
