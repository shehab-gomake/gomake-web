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
      <div style={clasess.sizeContainer}>{t("materials.inputs.weight")}</div>
      <div style={clasess.thiknessContainer}>
        {" "}
        {t("materials.inputs.price")}
      </div>
      <div style={clasess.costsContainer}>{t("materials.inputs.diameter")}</div>
      <div style={clasess.directionContainer}>
        {" "}
        {t("materials.inputs.lenght")}
      </div>
      <div style={clasess.activeContainer}>{t("products.actions.active")}</div>
      <div style={clasess.currencyContainer}>
        {" "}
        {t("materials.inputs.currency")}
      </div>
      <div style={clasess.stokContainer}>
        {" "}
        {t("materials.sheetPaper.stock")}
      </div>
    </div>

    //   <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
    //     <div style={clasess.sizeContainer}></div>
    //     <div style={clasess.thiknessContainer}>
    //
    //     </div>
    //     <div style={clasess.costsContainer}>
    //
    //     </div>
    //     <div style={clasess.directionContainer}>
    //
    //     </div>

    //     <div style={clasess.activeContainer}>
    //
    //     </div>
    //     <div style={clasess.currencyContainer}>
    //
    //     </div>
    //     <div style={clasess.stokContainer}>
    //
    //     </div>
    //   </div>
    // </div>
  );
};
export { HeaderTableWidget };
