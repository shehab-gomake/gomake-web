import {useMemo} from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: '40px',
                padding: '45px 30px 10px 30px',
                minHeight: '100vh'
            },
            header: {
                textAlign: 'center' as 'center'
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
