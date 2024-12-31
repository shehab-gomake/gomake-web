import { EditingIcon } from "@/pages-components/quotes/more-circle/icons/editing";
import { useTranslation } from "react-i18next";

const useMoreMenu = ({ preferenceItem, onClickEdit }: any) => {
  const { t } = useTranslation();

  const menuList = [
    {
      onclick: () => {
        onClickEdit(preferenceItem);
      },
      // onclick: () => {
      //   alert(preferenceItem?.preferenceId);
      // },
      icon: <EditingIcon />,
      name: t("sales.quote.edit"),
    },
  ];

  return {
    t,
    menuList,
  };
};

export { useMoreMenu };
