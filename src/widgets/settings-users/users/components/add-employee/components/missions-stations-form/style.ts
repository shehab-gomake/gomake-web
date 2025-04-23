import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
      searchFiledStyle: {
        borderRadius: "6px",
        background: "#FFF",
        display: "flex",
        border: "1px solid #D0D5DD",
        "& .MuiOutlinedInput-root": {
          "& input": {
            height: "40px",
            width: "100%",
          },
        },
      },
      listContainer: {
        position: "sticky" as "sticky",
        top: 0,
        backgroundColor: "#FFF",
        zIndex: 1,
      },
      modalContainer: { height: "fit-content", width: "40%" },
      buttonContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "10px",
      },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
