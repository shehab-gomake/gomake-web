import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            primaryLabel: {
                ...FONT_FAMILY.Lexend(500, 14),
                color: primaryColor(600),
                maxWidth: 'fit-content'
            },
            secondLabel: {
                ...FONT_FAMILY.Lexend(500, 14),
                color: '#797C80',
                maxWidth: 'fit-content'
            },
            jobTitle: {
                ...FONT_FAMILY.Lexend(500, 18),
                color: '#17181A',
                maxWidth: 'fit-content'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};