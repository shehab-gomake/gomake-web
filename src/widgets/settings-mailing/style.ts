import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            headerContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: 40,
            },
            editorModalStyle: {
                paddingLeft: 20,
                padding: 20,
                gap: "15px",
                width: "852px"
            },
            groupModalStyle: {
                paddingLeft: 20,
                padding: 20,
                width: "518px",
                height: "214px"
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
