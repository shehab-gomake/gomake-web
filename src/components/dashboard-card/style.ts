import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px',
                padding: '20px',
                position: 'relative' as 'relative'
            },
            label: {
               ...FONT_FAMILY.Poppins(500, 16),
                color: '#FFFFFF'
            },
            value: {
                ...FONT_FAMILY.Poppins(600, 24),
                color: '#FFFFFF',
                margin: '16px 0 8px 0',
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
            progressWrapper: {
                position: 'absolute' as 'absolute',
                top: '30px',
                right: '20px',
                color: '#fff',
                opacity: 0.6,
            },

        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
