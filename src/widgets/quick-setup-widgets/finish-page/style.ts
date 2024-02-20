import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {convertWidthToVW} from "@/utils/adapter";

const useStyle = () => {
  const {theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      container: {
        backgroundColor: '#504FA1',
        color: '#FFF',
        ...FONT_FAMILY.Outfit(600, 36)
      },
      button: {
        backgroundColor: primaryColor(50),
        color: primaryColor(500),
        width: convertWidthToVW(396),
        textTransform: 'capitalize' as 'capitalize'
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
