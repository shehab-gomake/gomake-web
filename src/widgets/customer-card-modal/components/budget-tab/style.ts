import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";


const useStyle = () => {
    const clasess = useMemo(() => {
        return {
            insideStyle: {
                width: "618px",
                height: "453px",
                flexShrink: 0,
                borderRadius: "16px",
                background: "var(--puree, #FFF)",
                boxShadow: "0px 4px 40px 0px rgba(0, 0, 0, 0.08)",
            },

            headerStyle: {
                color: "var(--primary-900, #090A1D)",
                texAlign: "center",
                fontStyle: "normal",
                lineHeight: "normal",
                ...FONT_FAMILY.Lexend(500, 14),
            },

            inputStyle: {
                width: "180px",
                height: "40px",
                flexShrink: 0,
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0px 4px 60px 0px #00000014",
                border: "none",
                ...FONT_FAMILY.Lexend(500, 14),
                color: "#8283BE",
            },

            autoComplateStyle: {
                display: "flex",
                width: "180px",
                height: "40px",
                flexShrink: 0,
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0px 4px 60px 0px #00000014",
                border: "none",
                ...FONT_FAMILY.Lexend(500, 14),
                color: "#8283BE",
              },

              buttonsStyle: {
                color: "var(--primary-500, #2E3092)",
                fontStyle: "normal",
                lineHeight: "normal",
                letterSpacing: "-0.14px",
                border: "none",
                background: "#FFF", 
                marginLeft: "7px",
                ...FONT_FAMILY.Lexend(500, 14),
              },

        };
    }, []);
    return {
        clasess,
    };
};
export { useStyle };

