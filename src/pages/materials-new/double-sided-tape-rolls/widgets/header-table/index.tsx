import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";
import { Checkbox } from "@mui/material";

const HeaderTableWidget = ({ setSheetCheckStore, sheetCheckStore, index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.header}>
      <div style={clasess.costsContainer}>{t("materials.inputs.height")}</div>
      <div style={clasess.costsContainer}>{t("materials.inputs.width")}</div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.weightPerSquareMeter")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.pricePerUnit")}
      </div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
      <div style={clasess.stokContainer}>{t("materials.sheetPaper.stock")}</div>
    </div>
  );
};
export { HeaderTableWidget };
