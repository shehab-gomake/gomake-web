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
        ...FONT_FAMILY.Outfit(600, 24)
      },
      input: {
        height: 40,
        width: 400,
        textAlign: 'center',
      },
      nameInput: {
        height: 40,
        width: 180,
        textAlign: 'center'
      },
      nextButton: {
        width: '100%'
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
