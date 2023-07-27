import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";
import { Checkbox } from "@mui/material";

const HeaderTableWidget = ({ setSheetCheckStore, sheetCheckStore, index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.header}>
      <div style={clasess.checkboxHeaderContainer}>
        <Checkbox
          onChange={() => {
            setSheetCheckStore(!sheetCheckStore);
          }}
          checked={sheetCheckStore}
        />
      </div>

      <div style={clasess.costsContainer}>{t("materials.inputs.material")}</div>
      <div style={clasess.costsContainer}>{t("materials.inputs.pitch")}</div>
      <div style={clasess.twintyContainer}>
        {t("materials.inputs.loopsQuantity")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.speralSize")} (inch)
      </div>
      <div style={clasess.maxBookThickness}>
        {t("materials.inputs.maxBookThickness")} (cm)
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.pricePerDrum")}
      </div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.stokContainer}>
        {t("materials.sheetPaper.stock")} (loops)
      </div>
      {/* <div style={clasess.weightContainer}>
        {t("materials.inputs.weight")} (kg)
      </div> */}
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
