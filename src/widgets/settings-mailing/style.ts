import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            Headercontainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: 40,
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
