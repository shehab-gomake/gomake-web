import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                position: "relative" as "relative",
                display: "flex",
                flexDirection: 'column' as 'column',
                gap: "16px"
            },
            header: {
                position: 'sticky' as 'sticky',
                top: 0,
                width: '100%',
                backgroundColor: '#FFF',
                zIndex: 1,
                padding: 1,
                paddingTop: 0,
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
