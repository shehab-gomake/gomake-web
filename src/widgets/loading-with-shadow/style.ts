import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
    const { primaryColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            containerStyle: {
                display: "flex",
                flexDirection: "column" as "column",
                justifyContent: "center",
                alignItems: "center",
                position: "relative" as "relative"
            },
            textStyle: {
                marginTop: "10px",
                color: primaryColor(600),
                fontWeight: "bold",
                fontSize: "16px",

            },
            dot: {
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: primaryColor(600),
                margin: "0 4px",
                animation: "dot-blink 1.4s infinite both",
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
