import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const classes = useMemo(() => {
    return {
        inputContainer: {
            display: "flex",
            flexDirection: "column" as "column",
            gap: 10,
            width:"330px",
          },
          fileInputStyle:{
            boxSizing: 'border-box' as 'border-box',
            borderRadius: '4px',
            minHeight:'40px',
            padding:'7px',
            ...FONT_FAMILY.Lexend(300, 14),
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.08)',
            width: '100%',
            color: '#8283BE',
            justifyContent:'space-between',
          },
    };
  }, []);
  return {
    classes,
  };
};
export { useStyle };
