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
      <div style={clasess.thiknessContainer}>{t("materials.inputs.size")}</div>
      <div style={clasess.directionContainer}>
        {t("materials.inputs.pricePerSquareMeter")}
      </div>
      <div style={clasess.activeContainer}>
        {t("materials.inputs.thickness")}
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.stokContainer}>{t("materials.sheetPaper.stock")}</div>
    </div>
  );
};
export { HeaderTableWidget };
