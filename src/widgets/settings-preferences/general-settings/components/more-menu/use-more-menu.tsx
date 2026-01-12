import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { EditingIcon } from "@/pages-components/quotes/more-circle/icons/editing";
import { useTranslation } from "react-i18next";

const useMoreMenu = ({ preferenceItem, onClickEdit }: any) => {
  const { t } = useTranslation();
  const { primarySecondaryBlend } = useGomakeTheme();
  const menuList = [
    {
      onclick: () => {
        onClickEdit(preferenceItem);
      },
      icon: <EditingIcon color={primarySecondaryBlend(500)} />,
      name: t("sales.quote.edit"),
    },
  ];

  return {
    t,
    menuList,
  };
};

export { useMoreMenu };
