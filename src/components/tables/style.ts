import {CSSProperties, useMemo} from "react";
import {adaptRight} from "@/utils/adapter";

const useStyle = (maxHeight: number, dir: 'rtl' | 'ltr') => {
    const classes = useMemo((): Record<string, CSSProperties> => {
        return {
            tableContainer: {
                maxHeight: maxHeight ? maxHeight : '100%',
                boxSizing: 'border-box'
            },
            sticky: {
                position: "sticky",
                background: "white",
                zIndex: 1,
                ...adaptRight(dir, 0),
                textAlign: dir === 'rtl' ? 'right' : 'left'
            },
            stickyHeader: {
                position: "sticky",
                ...adaptRight(dir, 0),
                zIndex: 999,
                minWidth: '250px'
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
