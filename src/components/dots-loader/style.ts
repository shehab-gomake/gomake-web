import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                justifyContent: 'center',
                margin: '0px auto',
            },
            dot: {
                width: '5px',
                height: '5px',
                margin: '1px 4px',
                borderRadius: '50%',
                backgroundColor: primaryColor(500),
                opacity: 1,
            }
        }
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
