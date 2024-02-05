import {CSSProperties, useMemo} from "react";
import {adaptRight} from "@/utils/adapter";
import { convertHeightToVH} from "@/utils/adapter";

const useStyle = (maxHeight: number, dir: 'rtl' | 'ltr') => {
    const classes = useMemo((): Record<string, CSSProperties> => {
        return {
            tableContainer: {
                position:"relative",
                overflow:"scroll" as "scroll",
                boxSizing: 'border-box',
                 width: "100%", 
                 maxHeight: convertHeightToVH(maxHeight) 
            },
            sticky: {
                position: "sticky",
                background: "white",
                zIndex: 1,
                ...adaptRight(dir, 0),
             //  textAlign: dir === 'rtl' ? 'right' : 'left',
               textAlign: 'center'

            },
            stickyHeader: {
                position: "sticky",
                ...adaptRight(dir, 0),
                zIndex: 999,
                minWidth: '250px'
            }
        };
    }, [maxHeight]);
    return {
        classes,
    };
};
export {useStyle};
