import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            button: {
                width: '163px',
                height: '40px',
                borderRadius: '10px',
                border: '1px solid #504FA1',
                backgroundColor: 'inherit',
                ...FONT_FAMILY.Lexend(500,16),
                cursor: 'pointer',
                color: '#504FA1',
            },
            datepickerContainer: {
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: '#fff',
                padding: '5px',
                borderRadius: '16px',
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
