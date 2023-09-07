import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useMemo } from "react";
import { FONT_FAMILY } from "@/utils/font-family";
import {convertWidthToVW, leftRightAdapter} from "@/utils/adapter";
import {useTranslation} from "react-i18next";

const useStyle = () => {
  const { theme, primaryColor } = useGomakeTheme();
  const {t} = useTranslation();
  const classes = useMemo(() => {
    return {
      container: {
        display: 'flex',
        gap: 10,
        alignItems: 'center' as 'center',
        justifyContent: 'flex-end',

      },
      searchInput: {
        maxWidth: 335,
        height: 40,
        width: convertWidthToVW(375),
        backgroundColor: "#F8F8F8",
        borderRadius: 10,
      },
      switchLabel: {
        ...FONT_FAMILY.Lexend(400, 12),
        color: primaryColor(9800),
        minWidth: 'fit-content' as 'fit-content',
      },
      iconStyle: {
        position: "absolute" as "absolute",
        ...leftRightAdapter(t("direction"), 16),
        top: 10,
      },
    };
  }, [theme]);
  return {
    classes,
  };
};
export { useStyle };
