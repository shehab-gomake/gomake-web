import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import {adaptPaddingLeft, adaptPaddingRight, convertHeightToVH} from "@/utils/adapter";
import {useTranslation} from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor, secondColor } = useGomakeTheme();
  const {t} = useTranslation()
  const direction = t('direction');
  const classes = useMemo(() => {
    return {
      gridContainer: {
        display: 'grid',
        maxHeight: convertHeightToVH(1080 - 50),
        height: convertHeightToVH(1080 - 50),
        gridTemplateColumns: '20% auto',
        gridTemplateRows: '40px 40px auto 60px',
        // columnGap: '20px',
        ...adaptPaddingRight(direction, 10),
        gridTemplateAreas: `
      'header header'
      'menu subHeader '
      'menu main '
      'sideActionFooter footer '
    `,
      },
      sideList: {
        gridArea: 'menu',
        overflowY: 'auto' as 'auto',
      },
      main: {
        overflowY: 'auto' as 'auto',
        maxHeight: '100%',
        gridArea: 'main',
        padding: '0 10px'
      },
      header: {
        ...FONT_FAMILY.Lexend(700, 20),
        color: primaryColor(500),
        gridArea: 'header',
      },
      subHeader: {
        ...FONT_FAMILY.Lexend(500, 24),
        color: secondColor(500),
        paddingBottom: 12,
        gridArea: 'subHeader'
      },
      footer: {
        gridArea: 'footer',
        display: 'flex',
        alignItems: 'center' as 'center',
        backgroundColor: primaryColor(50),
        marginLeft: -10,
        ...adaptPaddingLeft(direction, 10),
      },
      sideActionFooter: {
        display: 'flex',
        gridArea: 'sideActionFooter',
        alignItems: 'center' as 'center',
        backgroundColor: primaryColor(50),
        padding: '0 10px'
      }
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
