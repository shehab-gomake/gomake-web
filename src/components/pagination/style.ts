import { useMemo } from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            paginationStyle: {
                display: "flex",
                width: "100%",
                flexDirection: "row" as "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: "0px",
            },
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };