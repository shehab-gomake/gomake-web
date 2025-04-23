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

      modalContainer: {
        // height: "54vh",
        height: "fit-content",
        width: "30%",
        minHeight: "30vh",
        minWidth: "500px",
      },
      // childrenCon: {
      //   height: "100%",
      //   display: "flex",
      //   flexDirection: "column" as "column",
      //   justifyContent: "space-between",
      //   padding: "8px 0px",
      // },

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
