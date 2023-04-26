import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = (bgColor: string) => {
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px',
                padding: '20px 20px 5px 20px',
                backgroundColor: bgColor,
            },
            label: {
               ...FONT_FAMILY.Poppins(500, 40),
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center' as 'center',
                justifyContent: 'center' as 'center',
                height: '50%',
                textAlign: 'center' as 'center',
                paddingBottom: '20px'

            },
            value: {
                ...FONT_FAMILY.Poppins(600, 55),
                color: '#FFFFFF',
                textAlign: 'center' as 'center',
                flex: 1
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
                minWidth: '60px'
            }

        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
