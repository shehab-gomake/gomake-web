import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
      },
      inputsRow: {
        display: 'flex',
        alignItems: 'center' as 'center',
        padding: '5px 0',
        gap: '15px'
      },
      inputs: {
        boxSizing: 'border-box' as 'border-box',
        borderRadius: '4px',
        height: '40px',
        padding: '6.5px 14px'
      },
      button: {
        width: 'fit-content' as 'fit-content',
        height: '40px'
      },
      deleteIcon: {
        cursor: 'pointer'
      },
      addColor: {
        alignSelf: 'flex-end',
      },

    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
