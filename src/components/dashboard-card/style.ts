import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = (bgColor: string, selected: boolean) => {
    const {primaryColor, theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px',
                backgroundColor: '#FFF',
                position: 'relative' as 'relative',
                borderColor: '#EAECF0'
            },
            label: {
               ...FONT_FAMILY.Inter(600, 16),
                color: primaryColor(900),
            },
            value: {
                ...FONT_FAMILY.Inter(600, 14),
                color: primaryColor(500),
            },
            iconWrapper: {
                backgroundColor: 'white',
                opacity: '0.5',
                minWidth: '26px',
                height: '26px',
                borderRadius: '6px',
                display: 'flex',
            },

        };
    }, [selected, theme]);
    return {
        classes,
    };
};
export {useStyle};
