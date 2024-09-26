import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
    const { theme, primaryColor, grayColor, secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            saveSelectionModalStyle: {
                // width: "25%",
                width: "544px",
                borderRadius: "8px",
                height: "auto",
                maxHeight: 600,
                zIndex: 999999,
                padding: "20px"
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };