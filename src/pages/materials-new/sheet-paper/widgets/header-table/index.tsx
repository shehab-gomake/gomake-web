import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";
import { Checkbox } from "@mui/material";

const HeaderTableWidget = ({ setSheetCheckStore, sheetCheckStore, index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div
      style={{
        ...clasess.header,
      }}
    >
      <div style={clasess.checkboxHeaderContainer}>
        <Checkbox
          onChange={() => {
            setSheetCheckStore(!sheetCheckStore);
          }}
          checked={sheetCheckStore}
        />
      </div>
      <div style={clasess.weightContainer}>{t("materials.inputs.weight")}</div>
      <div style={clasess.rowWeightContainer}>
        <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
          <div style={clasess.sizeContainer}>
            {t("materials.sheetPaper.inputs.size")}
          </div>
          <div style={clasess.thiknessContainer}>
            {t("materials.sheetPaper.inputs.thickness")}
          </div>
          <div style={clasess.costsContainer}>
            {t("materials.inputs.unitTon")}
          </div>
          <div style={clasess.currencyContainer}>
            {t("materials.inputs.currency")}
          </div>
          <div style={clasess.directionContainer}>
            {t("materials.inputs.directions")}
          </div>
          <div style={clasess.stokContainer}>
            {t("materials.sheetPaper.inputs.stock")}
          </div>
          <div style={clasess.activeContainer}>
            {t("products.actions.active")}
          </div>
        </div>
      </div>
    </div>
  );
};
export { HeaderTableWidget };
