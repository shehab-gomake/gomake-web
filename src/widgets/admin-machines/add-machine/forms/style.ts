import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap' as 'wrap'
      },
      navigationButtons: {
        display: 'flex',
        justifyContent: 'space-between' as 'space-between',
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
