import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
  const { primaryColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      insideStyle: {
        minWidth: "fit-content",
        width: "30%",
        borderRadius: 5,
        height: "auto",
        maxHeight: 500,
        backgroundColor: "#F6F6F6",
      },
      modalTitle: {
        ...FONT_FAMILY.Inter(600, 18),
        color: "#000000",
        paddingBottom: "10px",
      },
      updateBtn: {
        marginTop: 10,
        display: "flex",
        justifyContent: "center",
        width: "100%",
      },
      iconColor: primaryColor(300),
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
