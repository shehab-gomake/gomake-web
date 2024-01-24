import { useMemo } from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            firstContainer: {
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column" as "column",
                background: "#FFFFFF",
                overflow:"scroll"
            },
            iconStyle: {
                width: "100%",
                height: "7%",
                display: "flex",
                background: "#F4F1F6",
                padding: "22px 80px",
                alignItems: "center"
            },
            iconMobileStyle: {
                width: "100%",
                height: "7%",
                display: "flex",
                background: "#F4F1F6",
                alignItems: "center",
                padding: "22px 0px",
                justifyContent: "center",
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
