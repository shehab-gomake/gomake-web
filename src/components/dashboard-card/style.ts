import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = (bgColor: string) => {
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px',
                padding: '20px',
                backgroundColor: bgColor,
                display: 'flex',
                justifyContent: 'space-between' as 'space-between'

            },
            label: {
               ...FONT_FAMILY.Poppins(500, 30),
                color: '#FFFFFF',
                textAlign: 'center' as 'center'

            },
            value: {
                ...FONT_FAMILY.Poppins(600, 40),
                color: '#FFFFFF',
            },
            iconWrapper: {
                backgroundColor: 'white',
                opacity: '0.5',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center' as 'center',
                alignItems: 'center' as 'center',
            },
            cardValue: {
                display: 'flex',
                justifyContent: 'flex-start' as 'flex-start',
                alignItems: 'center' as 'center',
                flexDirection: 'column' as 'column',
            },

        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
