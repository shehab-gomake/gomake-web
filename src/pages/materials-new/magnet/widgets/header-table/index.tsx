import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";
import { Checkbox } from "@mui/material";

const HeaderTableWidget = ({ setSheetCheckStore, sheetCheckStore, index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div style={clasess.header}>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.width")} (cm)
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.height")} (cm)
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.weight")} (gm)
      </div>
      {/* <div style={clasess.thiknessContainer}>
        {t("materials.inputs.thickness")} (mm)
      </div> */}
      <div style={clasess.costsContainer}>{t("materials.inputs.withGlue")}</div>

      <div style={clasess.costsContainer}>{t("materials.inputs.linkage")}</div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.directPrinting")}
      </div>
      <div style={clasess.costsContainer}>{t("materials.inputs.price")}</div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.thickness")}
      </div>
      <div style={clasess.stokContainer}>
        {t("materials.sheetPaper.stock")} (units)
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
