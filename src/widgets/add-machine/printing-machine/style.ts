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
        padding: '5px 0'
      },
      inputs: {
        boxSizing: 'border-box' as 'border-box',
        borderRadius: '4px',
        height: '56px',
        padding: '6.5px 14px'
      },
      button: {
        width: 'fit-content' as 'fit-content'
      },
      deleteIcon: {
        cursor: 'pointer'
      },
      addColor: {
        alignSelf: 'flex-end'
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
