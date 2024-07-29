import { useMemo } from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            insideStyle: {
                width: "600px",
                borderRadius: 5,
                height: "fit-content",
            },
            mainContainer: {
                display: "flex",
                flexDirection: "column" as "column",
                alignItems: "flex-start",
                width: "100%",
                gap: 10,
                marginTop: 20
            },
            mainBtnContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                gap: 20,
                width: "100%",
            },
            cancelContainer: {
                display: "flex",
                height: 40,
                width: "fit-content",
                minWidth: "100px",
                border: "2px solid #DEDEDE",
                color: "black"
            },
            sendButtonStyle: {
                display: "flex",
                lineHeight: "20px",
                height: 40,
                width: "fit-content",
                minWidth: "100px"
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };
