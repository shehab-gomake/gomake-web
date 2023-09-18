import {useMemo} from "react";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {primaryColor} = useGomakeTheme();
    const classes = useMemo(() => {
        return {
           button: {
               border: "1px solid", color: primaryColor(500),
               height: 22,
               width: 22
           },
            menuItem: {
                display: 'flex',
                width: 125,
                justifyContent: 'space-between',
                alignItems: 'center',
                color: primaryColor(300)
            },
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
