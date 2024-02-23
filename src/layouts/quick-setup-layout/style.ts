import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { LAYOUT_DEFAULT_GAP, SIDE_MENU_Layout } from "@/utils/layout-config";
import { useMemo } from "react";

const useStyle = (color: 'primary' | 'cyan' | 'magenta') => {
  const { primaryColor, secondColor, successColor, theme } = useGomakeTheme();
  const classes = useMemo(() => {
  const backgroundColor = color === 'primary' ? primaryColor(400) : color === 'cyan' ? '#00AEEF' : '#ED028C';
    return {
      container: {
        height: '100vh'
      },
      header: {
        backgroundColor: backgroundColor,
        display: 'flex',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        height: convertHeightToVH(361)
      },
      title: {
        ...FONT_FAMILY.Outfit(600, 36),
        color: '#FFF'
      },
      body: {
        display: 'flex',
        justifyContent: 'center' as 'center',
        padding: '30px',
        backgroundColor: '#FFF'
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
