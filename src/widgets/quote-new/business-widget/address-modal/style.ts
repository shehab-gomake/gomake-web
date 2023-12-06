import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { grayColor } = useGomakeTheme();

    const classes = useMemo(() => {
        return {
            insideStyle: {
                width: "371px",
                height: "502px",
                padding: "20px",
                borderRadius: "24px",
            },
            saveBtn: {
                width: "331px",
                height: "40px",
                borderRadius: "8px",
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
