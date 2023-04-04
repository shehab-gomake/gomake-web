import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const useStyle = ({ width }: any) => {
  const { primaryColor } = useGomakeTheme();
  const clasess = useMemo(() => {
    return {
      headerItem: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: primaryColor(700),
        width: `${width}`,
        textalign: "center",
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 22,
        paddingRight: 22,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
