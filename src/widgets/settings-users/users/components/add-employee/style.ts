import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useMemo} from "react";

const useStyle = () => {
    const {theme, secondColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
            container: {
                maxHeight: '100%',
                position: 'relative' as 'relative'
            },
            headerContainer: {
                position: 'sticky' as 'sticky',
                top: 0,
                backgroundColor: '#FFF',
                zIndex: 1
            },
            btnContainer: {
                display: 'flex',
                justifyContent: 'flex-end' as 'flex-end',
                position: 'sticky' as 'sticky',
                bottom: 0
            },
            actionBtn: {
                backgroundColor: secondColor(500),
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: secondColor(700),
                },
                textTransform: 'capitalize'

            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
