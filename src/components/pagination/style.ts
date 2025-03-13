import { useMemo } from "react";

const useStyle = (isMobile) => {
  const classes = useMemo(() => {
    return {
      paginationStyle: {
        display: "flex",
        width: "100%",
        flexDirection: isMobile ? ("column" as "column") : ("row" as "row"),
        ...(!isMobile && {
          alignItems: "center",

          marginTop: "0px",
        }),
        justifyContent: "space-between",
        paddingLeft: 20,
        paddingRight: 20,
      },
    };
  }, [isMobile]);
  return {
    classes,
  };
};
export { useStyle };
