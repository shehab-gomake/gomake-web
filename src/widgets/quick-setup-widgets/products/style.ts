import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";

const useStyle = () => {
  const {theme, primaryColor, neutralColor } = useGomakeTheme();
  const classes = useMemo(() => {
    return {
      header: {
        color: '#504FA1',
        ...FONT_FAMILY.Outfit(600, 24),
        textAlign: 'center' as 'center',
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
      },
      detailsKey: {
        ...FONT_FAMILY.Outfit(600, 16),
        color: primaryColor(300),
        border: 0
      },
      detailsValue: {
        ...FONT_FAMILY.Outfit(600, 16),
        color: primaryColor(800),
        border: 0
      }
    }
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
