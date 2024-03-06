import { useRouter } from "next/router";
import { useMemo } from "react";

const useStyle = () => {
  const router = useRouter();
  const clasess = useMemo(() => {
    return {
      mainHeaderContainer: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        backgroundColor: "#FFF",
        borderRadius: 17,
        padding: "15px 12px",
        minHeight: 590,
        height: "100%",
        gap: 16,
      },
    };
  }, []);
  return {
    clasess,
  };
};
export { useStyle };
