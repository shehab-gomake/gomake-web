import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
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
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
