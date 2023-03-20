import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: '40px',
                minHeight: '100vh'
            },
            header: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(400, 32)
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
