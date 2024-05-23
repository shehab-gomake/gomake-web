import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = (bgColor: string, selected: boolean) => {
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px',
                padding: '20px 20px 5px 20px',
                backgroundColor: bgColor,
                cursor: 'pointer',
                opacity: selected ? 0.5 : 1
            },
            label: {
               ...FONT_FAMILY.Lexend(500, 30),
                color: '#FFFFFF',
            },
            value: {
                ...FONT_FAMILY.Lexend(600, 40),
                color: '#FFFFFF',
                textAlign: 'center' as 'center',
            },
            iconWrapper: {
                backgroundColor: 'white',
                opacity: '0.5',
                minWidth: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center' as 'center',
                alignItems: 'center' as 'center',
            },

        };
    }, [selected]);
    return {
        classes,
    };
};
export {useStyle};
