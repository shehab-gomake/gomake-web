import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { primaryColor , secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            iconStyle: {
                color: secondColor(300),
                background :primaryColor(300),
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
