import { convertHeightToVH } from "@/utils/adapter";
import { useMemo } from "react";

const useStyle = ({ marginTop, marginBottom }) => {
  const classes = useMemo(() => {
    return {
      container: {
        marginTop: marginTop ? marginTop : convertHeightToVH(40),
        marginBottom: marginBottom ? marginBottom : convertHeightToVH(50),
      },
    };
  }, [marginTop, marginBottom]);

  return {
    classes,
  };
};
export { useStyle };
