import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import {FONT_FAMILY} from "@/utils/font-family";

const useStyle = () => {
  const { theme } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      tableHeader: {
        backgroundColor: '#F9FAFB',
        textAlign: 'center',
        ...FONT_FAMILY.Inter(700, 18),
        border: '1px solid #EAECF0'
      },
      tableCell: {
        border: '1px solid #EAECF0',
        backgroundColor: '#FFF',
        height: '100px',
        ...FONT_FAMILY.Inter(400, 16)
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
