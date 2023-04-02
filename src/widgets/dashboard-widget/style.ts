import {useMemo} from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: '30px',

            },
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
