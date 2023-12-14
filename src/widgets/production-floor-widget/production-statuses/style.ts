import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";

const useStyle = () => {
    const {theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                height: '35px',
                padding: '6px 12px',
                margin: 0,
                '&:hover': {
                    opacity: 0.8
                },
            },
        labelContainer: {
            display: 'flex',
            alignItems: 'center' as 'center',
            gap: '6px',
            textTransform: 'capitalize' as 'capitalize',
            padding: '0 6px',
        }
        }
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
