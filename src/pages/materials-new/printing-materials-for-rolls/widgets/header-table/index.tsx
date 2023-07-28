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
      <div style={clasess.heightContainer}>
        {t("materials.plat.inputs.width")}
      </div>
      <div style={clasess.heightContainer}>
        {t("materials.printingMaterials.inputs.length")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.printingMaterials.inputs.weight")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.withPremier")}
      </div>

      <div style={clasess.costsContainer}>
        {t("materials.inputs.pricePerSquareMeter")}
      </div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>

      <div style={clasess.stokContainer}>
        {t("materials.printingMaterials.inputs.stock")}
      </div>
      <div style={clasess.costsContainer}>{t("materials.inputs.machine")}</div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
