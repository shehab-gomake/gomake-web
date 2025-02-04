import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {theme, primaryColor, neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        color: primaryColor(600),
        ...FONT_FAMILY.Outfit(600, 24),
        margin: 0,
        padding: 0
      },
      nextButton: {
        width: '50%',
        backgroundColor: '#00AEEF',
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
      },
      materialsContainer: {
        width: convertWidthToVW(750),
        height: convertHeightToVH(250),
        border: '1px solid' + neutralColor(200),
        borderRadius: 4
      },
      materialsSelect: {
        width: convertWidthToVW(375)
      },
      parameterInput: {

      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
