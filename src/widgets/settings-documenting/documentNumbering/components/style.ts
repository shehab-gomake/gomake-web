import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
    const { theme , secondColor } = useGomakeTheme();
    const classes = useMemo(() => {
        return {
              actionBtn: {
                width: "123px",
                height :"40px",
                backgroundColor: secondColor(500),
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: secondColor(700),
                },
                ...FONT_FAMILY.Lexend(500, 16),
            }   
        };
    }, [theme]);
    return {
        classes,
    };
};
export { useStyle };
