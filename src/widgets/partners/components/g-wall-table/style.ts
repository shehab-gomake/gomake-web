import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";

const useStyle = () => {
    const { primaryColor, errorColor, neutralColor , successColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            tableStyle: {
                //border: "1px dotted #c9c8c3",
                borderRadius: 4,
                width: "99%",
                boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
            },
            headersStyle: {
                color: primaryColor(800),
                ...FONT_FAMILY.Lexend(500, 14),
                letterSpacing: '-1%',
                lineHeight: "17.5px",
            },
            dataRowStyle: {
                ...FONT_FAMILY.Lexend(500, 14),
                lineHeight: "17.5px",
                color: primaryColor(500),
                letterSpacing: '-1%',
            },
            insideStyle: {
                width: "710px",
                height: "190px",
                borderRadius: "16px",
                padding: 20,
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: "20px",
                color: primaryColor(800),
            },
            insideStyle1: {
                width: "790px",
                height: "1055px",
                borderRadius: "0px",
                padding: 20,
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: "20px",
                color: primaryColor(800),
            },
            blockBtnStyle: {
                background: errorColor(500),
                padding: "10px, 32px, 10px, 32px",
                width: "108px",
                height: "40px"
            },
            cancelBtnStyle: {
                padding: "10px, 32px, 10px, 32px",
                width: "108px",
                height: "40px",
                borderColor: neutralColor(700),
                color: neutralColor(700)
            },
            acceptedStyle:{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "71px",
                height: "22px",
                padding: "2px, 12px, 2px, 12px",
                borderRadius: "17px",
                color: successColor(500),
                background: successColor(100),
                ...FONT_FAMILY.Lexend(500, 14),
            },
            deniedStyle:{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "71px",
                height: "22px",
                padding: "2px, 12px, 2px, 12px",
                borderRadius: "17px",
                color: errorColor(400),
                background: errorColor(100),
                ...FONT_FAMILY.Lexend(500, 14),
            }

        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
