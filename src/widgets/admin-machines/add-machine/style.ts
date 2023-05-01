import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const {theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            stepLabelContainer: {
                display: 'flex',
                alignItems: 'center' as 'center',
                gap: '5px',
                ...FONT_FAMILY.Lexend(500, 16),
                color: 'blue'
            },
            stepLabel: {

            },
            stepContainer: {
                border: 0,
            },
            navigationButtons: {
                display: 'flex',
                justifyContent: 'space-between' as 'space-between',
                padding: '10px'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
