import { FONT_FAMILY } from "@/utils/font-family";
import { useTranslation } from "react-i18next";

const HeaderMapping = ({ item, index }) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === 'rtl';
  return (
    <div
      style={{
        minWidth: index == 0 ? "50%" : "25%",
        maxWidth: index == 0 ? "50%" : "25%",
        textAlign: RTL ? "right" : "left",
        ...FONT_FAMILY.Lexend(500, 12),
      }}
    >
      {item?.name}
    </div>
  );
};
export { HeaderMapping };
