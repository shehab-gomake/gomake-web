import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {

            },
            button: {
                backgroundColor: '#F9FBFF',
                boxShadow: '0px 4px 90px rgba(135, 130, 130, 0.2)',
                borderRadius: '10px',
                color: '#1C1D58',
                width: '190px',
                height: '40px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...FONT_FAMILY.Lexend(500,12)

    }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
