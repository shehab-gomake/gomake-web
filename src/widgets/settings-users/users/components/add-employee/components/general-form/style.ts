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
                margin: '24 0 18 0'
            },
            inputsContainer: {
                display: "flex",
                gap: 30,
                flexWrap: 'wrap' as 'wrap'
            },
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: 24, paddingTop: 24
            },
            subSection: {
                display: "flex",
                flexDirection: 'column' as 'column',
                gap: 18
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
