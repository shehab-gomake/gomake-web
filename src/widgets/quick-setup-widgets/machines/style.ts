import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { LAYOUT_DEFAULT_GAP, SIDE_MENU_Layout } from "@/utils/layout-config";
import { useMemo } from "react";

const useStyle = () => {
  const {theme, primaryColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        color: primaryColor(600),
        ...FONT_FAMILY.Outfit(600, 24),
        margin: 0,
        padding: 0
      },
      nextButton: {
        width: '100%'
      },
      inputsContainer: {
        display: 'flex',
        rowGap: 24,
        columnGap: 16,
        flexWrap: 'wrap' as 'wrap'
      },
      listItem: {
        height: '20px',
        display: 'flex',
        padding: 0,
        '& .MuiListItemIcon-root': {
          minWidth: 0
        }
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
