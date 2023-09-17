import {CSSProperties, useMemo} from "react";

const useStyle = (maxHeight: number) => {
    const classes = useMemo((): Record<string, CSSProperties> => {
        return {
            tableContainer: {
                maxHeight: maxHeight,
                boxSizing: 'border-box'
            },
            sticky: {
                position: "sticky",
                left: 0,
                background: "white",
                zIndex: 1
            },
            stickyHeader: {
                position: "sticky",
                left: 0,
                zIndex: 999,
                minWidth: '60px'
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
