import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
    const { theme } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            insideStyle: {
                paddingLeft: 15,
                paddingTop: 15,
                paddingRight: 0,
                width: "24%",
                height: "36%"
                , borderRadius: 16
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
