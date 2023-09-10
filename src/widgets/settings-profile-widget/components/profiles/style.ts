import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            subSectionHeader: {
                ...FONT_FAMILY.Lexend(600, 16),
                color: secondColor(500),
            },
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
