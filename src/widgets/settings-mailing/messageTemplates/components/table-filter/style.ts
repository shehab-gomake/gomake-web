import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        position: 'sticky' as 'sticky',
        top: 0,
        width: '100%',
        backgroundColor: '#FFF',
        zIndex: 1,
        padding: 1,
        paddingTop: 0,
        paddingBottom: '12px',
        justifyContent: 'space-between'
      },
      switchStyle: {
        display: "flex",
        alignItems: 'center',
        flexDirection: 'row-reverse' as 'row-reverse' ,
        gap: 8,
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
