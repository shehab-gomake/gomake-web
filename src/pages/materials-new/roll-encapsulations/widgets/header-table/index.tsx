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

      <div style={clasess.rowWeightContainer}>
        <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
          <div style={clasess.weightContainer}>
            {t("materials.inputs.weight")}
          </div>
          <div style={clasess.sizeContainer2}>
            {t("materials.inputs.size")} (cm*m)
          </div>
          <div style={clasess.sizeContainer}>
            {t("materials.inputs.thickness")} (µm)
          </div>
          <div style={clasess.thiknessContainer}>
            {t("materials.printingMaterials.inputs.weight")}
          </div>
          <div style={clasess.thiknessContainer}>
            {t("materials.inputs.pricePerSquareMeter")}
          </div>
          <div style={clasess.currencyContainer}>
            {t("materials.inputs.currency")}
          </div>
          <div style={clasess.stokContainer}>
            {t("materials.sheetPaper.stock")} (m)
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
