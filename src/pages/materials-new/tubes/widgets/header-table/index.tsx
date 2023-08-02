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
      <div style={clasess.costsContainer}>
        {t("materials.tubes.inputs.diameter")}
      </div>
      <div style={clasess.directionContainer}>
        {t("materials.tubes.inputs.lenght")}
      </div>

      <div style={clasess.thiknessContainer}>{t("materials.inputs.price")}</div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>

      <div style={clasess.sizeContainer}>
        {t("materials.tubes.inputs.weight")}
      </div>

      <div style={clasess.stokContainer}>
        {t("materials.tubes.inputs.stock")}
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
