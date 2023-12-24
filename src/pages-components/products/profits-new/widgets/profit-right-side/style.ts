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
        maxHeight: router.query.draftId ? 560 : "100vh",
        backgroundColor: "#FFF",
        borderRadius: 17,
        padding: "15px 12px",
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
