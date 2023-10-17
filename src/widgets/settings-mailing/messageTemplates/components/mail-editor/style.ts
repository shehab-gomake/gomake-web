import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

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
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
