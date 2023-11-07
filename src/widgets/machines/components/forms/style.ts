import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column' as 'column',
        gap: 61,
        padding: '20px 0'
      },
      inputsContainer: {
        display: 'flex',
        rowGap: 24,
        columnGap: 16,
        flexWrap: 'wrap' as 'wrap'
      },
      navigationButtons: {
        display: 'flex',
        justifyContent: 'flex-end' as 'flex-end',
        gap: 10,
        position: 'sticky' as 'sticky',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FFF',
        marginTop: '5px'
      },
      actionButton: {
        height: 40,
        width: 'fit-content'
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
