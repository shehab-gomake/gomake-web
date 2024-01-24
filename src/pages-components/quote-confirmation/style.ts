import { useMemo } from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            firstContainer: {
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column" as "column",
                background: "#FFFFFF"
            },
            secondContainer: {
                width: "100%",
                height: "7%",
                display: "flex",
                background: "#F4F1F6",
                padding: "10px"
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
