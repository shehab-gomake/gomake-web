import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";

const HeaderTableWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.header}>
      <div style={clasess.costsContainer}>{t("materials.inputs.price")}</div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.weight")} (gm)
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.adaptationField")}
      </div>
      <div style={clasess.stokContainer}>
        {t("materials.sheetPaper.stock")} (units)
      </div>

      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
