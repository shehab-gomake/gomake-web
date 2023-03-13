import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                height: '100%',
                width: '100%',
                borderRadius: '16px'
            },
            label: {
               ...FONT_FAMILY.Poppins(500, 16),
                color: '#FFFFFF'
            },
            value: {
                ...FONT_FAMILY.Poppins(600, 24),
                color: '#FFFFFF'

            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
