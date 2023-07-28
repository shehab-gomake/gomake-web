import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";

const HeaderTableWidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.header}>
      <div style={clasess.costsContainer}>{t("materials.inputs.machine")}</div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.volumeInLiters")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.inkConsumption")}
      </div>
      <div style={clasess.costsContainer}>
        {t("materials.inputs.weight")} (litter)
      </div>
      {/* <div style={clasess.costsContainer}>{t("materials.inputs.typeName")}</div> */}

      <div style={clasess.costsContainer}>
        {t("materials.inputs.literInSquareMeter")}
      </div>
      {/* <div style={clasess.costsContainer}>
        {t("materials.inputs.pricePerContainer")}
      </div> */}
      <div style={clasess.costsContainer}>
        {t("materials.inputs.pricePerLiter")}
      </div>
      <div style={clasess.currencyContainer}>
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.stokContainer}>
        {t("materials.sheetPaper.stock")} (litter)
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
    </div>
  );
};
export { HeaderTableWidget };
