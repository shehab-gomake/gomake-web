import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";

const useStyle = () => {
    const {theme} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            tabStyle: {
                display: 'flex',
                justifyContent: 'flex-end' as 'flex-end',
                position: 'sticky' as 'sticky',
                bottom: 0
            },
        }
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
