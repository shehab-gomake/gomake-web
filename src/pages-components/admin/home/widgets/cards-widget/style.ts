import { useMemo } from "react";


const useStyle = () => {
    const classes = useMemo(() => {
        return {
            mainContainer: {
                display: "flex",
                flexDirection: "row" as "row",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                width: "100%",
                height: "100%",
                padding: "20px",
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 1px 0px 0 rgba(0, 0, 0, 0.08), 0 0px 5px 0 rgba(0, 0, 0, 0.08)",
                gap: 15,
            },
            firstDiv: {
                display: "flex",
                flexDirection: "column" as "column",
                height: "100%",
                width: "50%",
                gap: "10px"
            },
            secondDiv: {
                display: "flex",
                flexDirection: "column" as "column",
                height: "100%",
                width: "50%",
                gap: "10px"
            },
            firstCard: {
                display:"flex",
                width: "100%",
                height: "50%",
                alignItems: "center",
              //  boxShadow: "none",
            },
            secondCard: {
                display:"flex",
                width: "100%",
                height: "25%" ,
                alignItems: "center",
               // boxShadow: "none",
            }
        };
    }, []);
    return {
        classes,
    };
};
export { useStyle };